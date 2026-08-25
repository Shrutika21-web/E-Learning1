const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  validate,
  addCourseValidationRules,
  updateCourseValidationRules,
  courseIdParamValidationRules,
  dateRangeQueryValidationRules,
} = require('../validators/courseValidator');

// GET /course/all-active-courses  (public)
router.get('/all-active-courses', courseController.getAllActiveCourses);

// GET /course/all-courses  (admin only)
router.get(
  '/all-courses',
  authenticate,
  authorize('admin'),
  dateRangeQueryValidationRules,
  validate,
  courseController.getAllCourses
);

// POST /course/add  (admin only)
router.post(
  '/add',
  authenticate,
  authorize('admin'),
  addCourseValidationRules,
  validate,
  courseController.addCourse
);

// PUT /course/update/:courseId  (admin only)
router.put(
  '/update/:courseId',
  authenticate,
  authorize('admin'),
  updateCourseValidationRules,
  validate,
  courseController.updateCourse
);

// DELETE /course/delete/:courseId  (admin only)
router.delete(
  '/delete/:courseId',
  authenticate,
  authorize('admin'),
  courseIdParamValidationRules,
  validate,
  courseController.deleteCourse
);

// GET /course/:courseId (public active course with lessons)
router.get('/:courseId', courseController.getActiveCourseWithVideos);

module.exports = router;
