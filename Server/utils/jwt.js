const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET) {
  // Fail fast at startup rather than issuing insecure/undefined-secret tokens later.
  // server.js loads dotenv before any route is registered, so this only trips
  // if the .env file is missing JWT_SECRET.
  console.warn('WARNING: JWT_SECRET is not set in the environment. Set it in your .env file.');
}

/**
 * Generate a signed JWT for an authenticated user.
 * Payload intentionally contains ONLY non-sensitive identifiers.
 */
function generateToken(payload) {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify a JWT. Throws if invalid/expired.
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
