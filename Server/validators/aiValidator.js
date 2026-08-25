const { body, validationResult } = require('express-validator');
const { error } = require('../utils/response');

const chatValidationRules = [
  body('question').trim().notEmpty().withMessage('question is required').isLength({ max: 1000 }).withMessage('question must be at most 1000 characters'),
  body('currentCourse').optional({ checkFalsy: true }).isString().isLength({ max: 100 }).withMessage('currentCourse must be at most 100 characters'),
];

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return error(res, 400, 'Validation failed', errors.array().map((item) => ({ field: item.path, message: item.msg })));
  next();
}

module.exports = { chatValidationRules, validate };