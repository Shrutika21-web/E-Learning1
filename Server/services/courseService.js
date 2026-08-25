const { pool } = require('../config/db');
const { AppError } = require('../middleware/errorMiddleware');

function mapCourseRow(row) {
  return {
    courseId: row.course_id,
    courseName: row.course_name,
    description: row.description,
    fees: row.fees,
    startDate: row.start_date,
    endDate: row.end_date,
    videoExpireDays: row.video_expire_days,
  };
}

/**
 * Courses that are currently active based on today's date falling
 * between start_date and end_date (inclusive).
 */
async function getAllActiveCourses() {
  const [rows] = await pool.execute(
    `SELECT course_id, course_name, description, fees, start_date, end_date, video_expire_days
     FROM courses
     WHERE CURDATE() BETWEEN start_date AND end_date
     ORDER BY start_date ASC`
  );
  return rows.map(mapCourseRow);
}

async function getAssistantCourses() {
  const [rows] = await pool.execute(
    `SELECT course_id, course_name, description, fees, start_date, end_date, video_expire_days
     FROM courses WHERE CURDATE() BETWEEN start_date AND end_date ORDER BY start_date ASC`
  );
  return rows.map(mapCourseRow);
}

/**
 * All courses, optionally filtered by a start/end date range that
 * overlaps the requested window.
 */
async function getAllCourses({ startDate, endDate } = {}) {
  let sql = `SELECT course_id, course_name, description, fees, start_date, end_date, video_expire_days
             FROM courses`;
  const conditions = [];
  const params = [];

  if (startDate) {
    conditions.push('start_date >= ?');
    params.push(startDate);
  }
  if (endDate) {
    conditions.push('end_date <= ?');
    params.push(endDate);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY start_date ASC';

  const [rows] = await pool.execute(sql, params);
  return rows.map(mapCourseRow);
}

async function getCourseById(courseId) {
  const [rows] = await pool.execute(
    `SELECT course_id, course_name, description, fees, start_date, end_date, video_expire_days
     FROM courses WHERE course_id = ?`,
    [courseId]
  );
  return rows.length ? mapCourseRow(rows[0]) : null;
}

async function getActiveCourseWithVideos(courseId) {
  const course = await getCourseById(courseId);
  if (!course || !(await isCourseActive(courseId))) return null;
  const [rows] = await pool.execute(
    `SELECT video_id, title, description, youtube_url
     FROM videos WHERE course_id = ? ORDER BY added_at ASC`,
    [courseId]
  );
  return { ...course, videos: rows.map((row) => ({ videoId: row.video_id, title: row.title, description: row.description, youtubeURL: row.youtube_url })) };
}

async function addCourse({ courseName, description, fees, startDate, endDate, videoExpireDays }) {
  const [result] = await pool.execute(
    `INSERT INTO courses (course_name, description, fees, start_date, end_date, video_expire_days)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [courseName, description || null, fees, startDate, endDate, videoExpireDays || 180]
  );
  return getCourseById(result.insertId);
}

async function updateCourse(courseId, { courseName, description, fees, startDate, endDate, videoExpireDays }) {
  const existing = await getCourseById(courseId);
  if (!existing) {
    throw new AppError('Course not found', 404);
  }

  await pool.execute(
    `UPDATE courses
     SET course_name = ?, description = ?, fees = ?, start_date = ?, end_date = ?, video_expire_days = ?
     WHERE course_id = ?`,
    [courseName, description || null, fees, startDate, endDate, videoExpireDays || existing.videoExpireDays, courseId]
  );

  return getCourseById(courseId);
}

async function deleteCourse(courseId) {
  const existing = await getCourseById(courseId);
  if (!existing) {
    throw new AppError('Course not found', 404);
  }

  // Foreign keys on enrollments.course_id and videos.course_id are defined
  // with ON DELETE CASCADE, so removing the course automatically removes
  // its enrollments and videos as well.
  await pool.execute('DELETE FROM courses WHERE course_id = ?', [courseId]);
  return true;
}

async function isCourseActive(courseId) {
  const [rows] = await pool.execute(
    `SELECT course_id FROM courses
     WHERE course_id = ? AND CURDATE() BETWEEN start_date AND end_date`,
    [courseId]
  );
  return rows.length > 0;
}

module.exports = {
  getAllActiveCourses,
  getAssistantCourses,
  getAllCourses,
  getCourseById,
  getActiveCourseWithVideos,
  addCourse,
  updateCourse,
  deleteCourse,
  isCourseActive,
};
