const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  validate,
  registerToCourseValidationRules,
  changePasswordValidationRules,
} = require('../validators/studentValidator');

// All student routes require student authentication.
router.use(authenticate, authorize('student'));

// POST /student/register-to-course
router.post('/register-to-course', registerToCourseValidationRules, validate, studentController.registerToCourse);

// PUT /student/change-password
router.put('/change-password', changePasswordValidationRules, validate, studentController.changePassword);

// GET /student/my-courses
router.get('/my-courses', studentController.getMyCourses);

// GET /student/my-course-with-videos
router.get('/my-course-with-videos', studentController.getMyCoursesWithVideos);

module.exports = router;
