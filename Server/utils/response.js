/**
 * Standardized API response helpers.
 * Ensures every endpoint in the application returns a consistent shape:
 *   Success: { success: true, message, data }
 *   Error:   { success: false, message, errors? }
 */

function success(res, statusCode = 200, message = 'Operation successful', data = null) {
  const body = { success: true, message };
  if (data !== null && data !== undefined) {
    body.data = data;
  }
  return res.status(statusCode).json(body);
}

function error(res, statusCode = 500, message = 'Something went wrong', errors = null) {
  const body = { success: false, message };
  if (errors) {
    body.errors = errors;
  }
  return res.status(statusCode).json(body);
}

module.exports = { success, error };
