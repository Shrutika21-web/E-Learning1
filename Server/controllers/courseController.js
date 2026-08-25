const courseService = require('../services/courseService');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * GET /course/all-active-courses  (public)
 */
const getAllActiveCourses = asyncHandler(async (req, res) => {
  const courses = await courseService.getAllActiveCourses();
  return success(res, 200, 'Active courses retrieved successfully', { courses });
});

const getActiveCourseWithVideos = asyncHandler(async (req, res) => {
  const course = await courseService.getActiveCourseWithVideos(req.params.courseId);
  if (!course) return res.status(404).json({ success: false, message: 'Course not available' });
  return success(res, 200, 'Course retrieved successfully', { course });
});

/**
 * GET /course/all-courses  (admin)
 * Optional query params: startDate, endDate
 */
const getAllCourses = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const courses = await courseService.getAllCourses({ startDate, endDate });
  return success(res, 200, 'Courses retrieved successfully', { courses });
});

/**
 * POST /course/add  (admin)
 */
const addCourse = asyncHandler(async (req, res) => {
  const { courseName, description, fees, startDate, endDate, videoExpireDays } = req.body;
  const course = await courseService.addCourse({ courseName, description, fees, startDate, endDate, videoExpireDays });
  return success(res, 201, 'Course created successfully', { course });
});

/**
 * PUT /course/update/:courseId  (admin)
 */
const updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { courseName, description, fees, startDate, endDate, videoExpireDays } = req.body;
  const course = await courseService.updateCourse(courseId, { courseName, description, fees, startDate, endDate, videoExpireDays });
  return success(res, 200, 'Course updated successfully', { course });
});

/**
 * DELETE /course/delete/:courseId  (admin)
 */
const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  await courseService.deleteCourse(courseId);
  return success(res, 200, 'Course deleted successfully. Associated enrollments and videos were removed.');
});

module.exports = { getAllActiveCourses, getActiveCourseWithVideos, getAllCourses, addCourse, updateCourse, deleteCourse };
