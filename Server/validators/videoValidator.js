const { body, param, query, validationResult } = require('express-validator');
const { error } = require('../utils/response');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 400, 'Validation failed', errors.array().map((e) => ({ field: e.path, message: e.msg })));
  }
  next();
}

// Reasonably strict but practical YouTube URL check (youtube.com/... or youtu.be/...)
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)[\w-]+|youtu\.be\/[\w-]+)([&?][\w=&-]*)?$/i;

const addVideoValidationRules = [
  body('courseId')
    .notEmpty().withMessage('courseId is required')
    .isInt({ min: 1 }).withMessage('courseId must be a valid positive integer'),
  body('title')
    .trim()
    .notEmpty().withMessage('title is required')
    .isLength({ max: 150 }).withMessage('title must be at most 150 characters'),
  body('youtubeURL')
    .trim()
    .notEmpty().withMessage('youtubeURL is required')
    .matches(YOUTUBE_URL_REGEX).withMessage('youtubeURL must be a valid YouTube URL'),
  body('description')
    .optional({ checkFalsy: true })
    .isString().withMessage('description must be text'),
];

const updateVideoValidationRules = [
  param('videoId').isInt({ min: 1 }).withMessage('videoId must be a valid positive integer'),
  ...addVideoValidationRules,
];

const videoIdParamValidationRules = [
  param('videoId').isInt({ min: 1 }).withMessage('videoId must be a valid positive integer'),
];

const courseIdQueryValidationRules = [
  query('courseId').optional().isInt({ min: 1 }).withMessage('courseId must be a valid positive integer'),
];

module.exports = {
  validate,
  addVideoValidationRules,
  updateVideoValidationRules,
  videoIdParamValidationRules,
  courseIdQueryValidationRules,
};
