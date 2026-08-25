const AppError = require('../utils/AppError');
const { sendError } = require('../utils/response');

const notFoundHandler = (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message);
  }

  if (err.name === 'ValidationError') {
    return sendError(res, 400, err.message);
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 409, 'Duplicate record already exists');
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return sendError(res, 400, 'Referenced record not found');
  }

  console.error('Unhandled error:', err);
  return sendError(res, 500, 'Internal server error');
};

module.exports = { notFoundHandler, errorHandler };
