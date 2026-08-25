const studentService = require('../services/studentService');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * POST /student/register-to-course  (student)
 * The student's identity comes ONLY from req.user (JWT), never from req.body.email.
 */
const registerToCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const { userId } = req.user;

  const enrollment = await studentService.registerToCourse(userId, courseId);
  return success(res, 201, 'Enrollment successful', { enrollment });
});

/**
 * PUT /student/change-password  (student)
 */
const changePassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const { userId } = req.user;

  await studentService.changePassword(userId, newPassword);
  return success(res, 200, 'Password changed successfully');
});

/**
 * GET /student/my-courses  (student)
 */
const getMyCourses = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const courses = await studentService.getMyCourses(userId);
  return success(res, 200, 'Courses retrieved successfully', { courses });
});

/**
 * GET /student/my-course-with-videos  (student)
 */
const getMyCoursesWithVideos = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const courses = await studentService.getMyCoursesWithVideos(userId);
  return res.status(200).json({ success: true, courses });
});

module.exports = { registerToCourse, changePassword, getMyCourses, getMyCoursesWithVideos };
