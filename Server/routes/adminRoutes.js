const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, enrolledStudentsQueryValidationRules } = require('../validators/studentValidator');
const { createAdminValidationRules } = require('../validators/authValidator');

// POST /admin/admins (admin only)
router.post('/admins', authenticate, authorize('admin'), createAdminValidationRules, validate, adminController.createAdmin);

// GET /admin/enrolled-students  (admin only)
router.get(
  '/enrolled-students',
  authenticate,
  authorize('admin'),
  enrolledStudentsQueryValidationRules,
  validate,
  adminController.getEnrolledStudents
);

module.exports = router;
