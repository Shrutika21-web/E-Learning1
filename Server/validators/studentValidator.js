const { body, query, validationResult } = require('express-validator');
const { error } = require('../utils/response');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 400, 'Validation failed', errors.array().map((e) => ({ field: e.path, message: e.msg })));
  }
  next();
}

const registerToCourseValidationRules = [
  body('courseId')
    .notEmpty().withMessage('courseId is required')
    .isInt({ min: 1 }).withMessage('courseId must be a valid positive integer'),
  body('name')
    .trim()
    .notEmpty().withMessage('name is required')
    .isLength({ max: 100 }).withMessage('name must be at most 100 characters'),
  body('mobileNo')
    .trim()
    .notEmpty().withMessage('mobileNo is required')
    .matches(/^\d{10}$/).withMessage('mobileNo must be exactly 10 digits'),
  // email is accepted for documentation/back-compat but is never trusted over the JWT identity.
  body('email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('email must be a valid email address'),
];

const changePasswordValidationRules = [
  body('newPassword')
    .notEmpty().withMessage('newPassword is required')
    .isLength({ min: 6 }).withMessage('newPassword must be at least 6 characters long'),
  body('confirmPassword')
    .notEmpty().withMessage('confirmPassword is required')
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.newPassword) {
        throw new Error('confirmPassword does not match newPassword');
      }
      return true;
    }),
];

const enrolledStudentsQueryValidationRules = [
  query('courseId').optional().isInt({ min: 1 }).withMessage('courseId must be a valid positive integer'),
];

module.exports = {
  validate,
  registerToCourseValidationRules,
  changePasswordValidationRules,
  enrolledStudentsQueryValidationRules,
};
