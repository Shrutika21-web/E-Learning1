const { body, param, query, validationResult } = require('express-validator');
const { error } = require('../utils/response');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 400, 'Validation failed', errors.array().map((e) => ({ field: e.path, message: e.msg })));
  }
  next();
}

const addCourseValidationRules = [
  body('courseName')
    .trim()
    .notEmpty().withMessage('courseName is required')
    .isLength({ max: 100 }).withMessage('courseName must be at most 100 characters'),
  body('description')
    .optional({ checkFalsy: true })
    .isString().withMessage('description must be text'),
  body('fees')
    .notEmpty().withMessage('fees is required')
    .isInt({ min: 0 }).withMessage('fees must be a number greater than or equal to 0'),
  body('startDate')
    .notEmpty().withMessage('startDate is required')
    .isISO8601().withMessage('startDate must be a valid date (YYYY-MM-DD)'),
  body('endDate')
    .notEmpty().withMessage('endDate is required')
    .isISO8601().withMessage('endDate must be a valid date (YYYY-MM-DD)')
    .custom((endDate, { req }) => {
      if (new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error('endDate must not be before startDate');
      }
      return true;
    }),
  body('videoExpireDays')
    .optional()
    .isInt({ min: 1 }).withMessage('videoExpireDays must be a positive integer'),
];

const updateCourseValidationRules = [
  param('courseId').isInt({ min: 1 }).withMessage('courseId must be a valid positive integer'),
  ...addCourseValidationRules,
];

const courseIdParamValidationRules = [
  param('courseId').isInt({ min: 1 }).withMessage('courseId must be a valid positive integer'),
];

const dateRangeQueryValidationRules = [
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid date (YYYY-MM-DD)'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid date (YYYY-MM-DD)'),
];

module.exports = {
  validate,
  addCourseValidationRules,
  updateCourseValidationRules,
  courseIdParamValidationRules,
  dateRangeQueryValidationRules,
};
