const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/response');

/**
 * Verifies the Authorization: Bearer <token> header, decodes the JWT,
 * and attaches the decoded payload ({ userId, email, role }) to req.user.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 401, 'Authorization header missing or malformed. Expected: Bearer <token>');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return error(res, 401, 'Access token is missing');
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { userId, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 401, 'Access token has expired. Please log in again.');
    }
    return error(res, 401, 'Invalid access token');
  }
}

module.exports = { authenticate };
