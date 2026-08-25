const studentService = require('../services/studentService');
const authService = require('../services/authService');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * GET /admin/enrolled-students  (admin)
 * Optional query param: courseId
 */
const getEnrolledStudents = asyncHandler(async (req, res) => {
  const { courseId } = req.query;
  const students = await studentService.getEnrolledStudents(courseId);
  return success(res, 200, 'Enrolled students retrieved successfully', { students });
});

const createAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await authService.createAdmin(email, password);
  return success(res, 201, 'Admin account created successfully', { admin });
});

module.exports = { getEnrolledStudents, createAdmin };
