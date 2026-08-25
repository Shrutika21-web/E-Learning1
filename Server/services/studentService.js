const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { AppError } = require('../middleware/errorMiddleware');
const courseService = require('./courseService');

const SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS ? Number(process.env.BCRYPT_SALT_ROUNDS) : 10;

/**
 * Look up the students row (reg_no, name, mobile_no, profile_pic) for a
 * given users.user_id. Returns null if the logged-in user has no student
 * profile (shouldn't happen for role='student' accounts created correctly,
 * but guarded defensively).
 */
async function getStudentByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT reg_no, user_id, name, mobile_no, profile_pic FROM students WHERE user_id = ?`,
    [userId]
  );
  return rows.length ? rows[0] : null;
}

/**
 * Registers the logged-in student (identified via JWT -> user_id) into a course.
 * Trusts ONLY the JWT for identity; the request body's courseId is the only
 * externally supplied value that is used.
 */
async function registerToCourse(userId, courseId) {
  const student = await getStudentByUserId(userId);
  if (!student) {
    throw new AppError('Student profile not found for the logged-in user', 404);
  }

  const course = await courseService.getCourseById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  const active = await courseService.isCourseActive(courseId);
  if (!active) {
    throw new AppError('Course is not currently active for enrollment', 400);
  }

  const [existingEnrollment] = await pool.execute(
    `SELECT enrollment_id FROM enrollments WHERE reg_no = ? AND course_id = ?`,
    [student.reg_no, courseId]
  );

  if (existingEnrollment.length > 0) {
    throw new AppError('Student is already enrolled in this course', 409);
  }

  // The UNIQUE (reg_no, course_id) constraint is a second line of defense
  // against race conditions between the check above and this insert.
  const [result] = await pool.execute(
    `INSERT INTO enrollments (reg_no, course_id) VALUES (?, ?)`,
    [student.reg_no, courseId]
  );

  const [rows] = await pool.execute(
    `SELECT enrollment_id, reg_no, course_id, enrolled_at, status
     FROM enrollments WHERE enrollment_id = ?`,
    [result.insertId]
  );

  const enrollment = rows[0];

  return {
    enrollmentId: enrollment.enrollment_id,
    regNo: enrollment.reg_no,
    courseId: enrollment.course_id,
    courseName: course.courseName,
    enrolledAt: enrollment.enrolled_at,
    status: enrollment.status,
  };
}

/**
 * Hashes and stores a new password for the logged-in user.
 */
async function changePassword(userId, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const [result] = await pool.execute(
    `UPDATE users SET password = ? WHERE user_id = ?`,
    [hashedPassword, userId]
  );

  if (result.affectedRows === 0) {
    throw new AppError('User not found', 404);
  }

  return true;
}

/**
 * All courses the logged-in student is enrolled in.
 * users -> students -> enrollments -> courses
 */
async function getMyCourses(userId) {
  const student = await getStudentByUserId(userId);
  if (!student) {
    throw new AppError('Student profile not found for the logged-in user', 404);
  }

  const [rows] = await pool.execute(
    `SELECT c.course_id, c.course_name, c.description, c.fees, c.start_date, c.end_date,
            c.video_expire_days, e.enrollment_id, e.enrolled_at, e.status
     FROM students s
     JOIN enrollments e ON e.reg_no = s.reg_no
     JOIN courses c ON c.course_id = e.course_id
     WHERE s.user_id = ?
     ORDER BY e.enrolled_at DESC`,
    [userId]
  );

  return rows.map((row) => ({
    courseId: row.course_id,
    courseName: row.course_name,
    description: row.description,
    fees: row.fees,
    startDate: row.start_date,
    endDate: row.end_date,
    enrollmentId: row.enrollment_id,
    enrolledAt: row.enrolled_at,
    status: row.status,
  }));
}

/**
 * All courses the logged-in student is enrolled in, along with only the
 * videos that are still within their validity window:
 *   NOW() <= enrolled_at + INTERVAL video_expire_days DAY
 * users -> students -> enrollments -> courses -> videos
 */
async function getMyCoursesWithVideos(userId) {
  const student = await getStudentByUserId(userId);
  if (!student) {
    throw new AppError('Student profile not found for the logged-in user', 404);
  }

  const [rows] = await pool.execute(
    `SELECT
        c.course_id, c.course_name, e.enrolled_at, c.video_expire_days,
        v.video_id, v.title, v.description AS video_description, v.youtube_url,
        (NOW() <= DATE_ADD(e.enrolled_at, INTERVAL c.video_expire_days DAY)) AS video_valid
     FROM students s
     JOIN enrollments e ON e.reg_no = s.reg_no
     JOIN courses c ON c.course_id = e.course_id
     LEFT JOIN videos v ON v.course_id = c.course_id
     WHERE s.user_id = ?
     ORDER BY e.enrolled_at DESC, v.added_at ASC`,
    [userId]
  );

  const coursesById = new Map();

  for (const row of rows) {
    if (!coursesById.has(row.course_id)) {
      coursesById.set(row.course_id, {
        courseId: row.course_id,
        courseName: row.course_name,
        enrolledAt: row.enrolled_at,
        videos: [],
      });
    }

    // Only include videos that exist (LEFT JOIN may yield null video rows
    // for courses with no videos yet) AND are still within their expiry window.
    if (row.video_id && Number(row.video_valid) === 1) {
      coursesById.get(row.course_id).videos.push({
        videoId: row.video_id,
        title: row.title,
        description: row.video_description,
        youtubeURL: row.youtube_url,
      });
    }
  }

  return Array.from(coursesById.values());
}

/**
 * Admin report: students enrolled in a course (or all courses if courseId omitted).
 * users -> students -> enrollments -> courses
 */
async function getEnrolledStudents(courseId) {
  let sql = `
    SELECT
      s.reg_no, s.name, u.email, s.mobile_no,
      c.course_id, c.course_name,
      e.enrolled_at, e.status
    FROM students s
    JOIN users u ON u.user_id = s.user_id
    JOIN enrollments e ON e.reg_no = s.reg_no
    JOIN courses c ON c.course_id = e.course_id`;

  const params = [];
  if (courseId) {
    sql += ' WHERE c.course_id = ?';
    params.push(courseId);
  }

  sql += ' ORDER BY c.course_id ASC, e.enrolled_at ASC';

  const [rows] = await pool.execute(sql, params);

  return rows.map((row) => ({
    regNo: row.reg_no,
    name: row.name,
    email: row.email,
    mobileNo: row.mobile_no,
    courseId: row.course_id,
    courseName: row.course_name,
    enrolledAt: row.enrolled_at,
    status: row.status,
  }));
}

module.exports = {
  getStudentByUserId,
  registerToCourse,
  changePassword,
  getMyCourses,
  getMyCoursesWithVideos,
  getEnrolledStudents,
};
