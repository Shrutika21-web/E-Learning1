const { error } = require('../utils/response');

/**
 * 404 handler for unmatched routes.
 */
function notFound(req, res, next) {
  return error(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}

/**
 * Centralized error handler. Any error passed to next(err) (or thrown inside
 * an async route wrapped with asyncHandler) ends up here.
 * Never leaks stack traces or raw DB error text to the client.
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);

  // MySQL duplicate entry (covers UNIQUE constraints like enrollments(reg_no, course_id) or users.email)
  if (err && err.code === 'ER_DUP_ENTRY') {
    return error(res, 409, 'A record with these details already exists');
  }

  // MySQL foreign key / check constraint violations
  if (err && (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_NO_REFERENCED_ROW_2')) {
    return error(res, 400, 'Referenced record does not exist');
  }

  if (err && err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    return error(res, 400, 'One or more values violate database constraints');
  }

  // Connection-level failures
  if (err && ['ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST', 'ER_ACCESS_DENIED_ERROR'].includes(err.code)) {
    return error(res, 500, 'Database connection error. Please try again later.');
  }

  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message = err.expose ? err.message : (statusCode === 500 ? 'Internal server error' : err.message);

  return error(res, statusCode, message || 'Internal server error');
}

/**
 * Wraps an async controller/service call so rejected promises are
 * forwarded to errorHandler instead of crashing the process.
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Lightweight application error class for expected, "safe to show" errors
 * (e.g. "Course not found") thrown from services/controllers.
 */
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.expose = true;
  }
}

module.exports = { notFound, errorHandler, asyncHandler, AppError };
