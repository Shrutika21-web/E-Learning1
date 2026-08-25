const AppError = require('../utils/AppError');
const { verifyToken } = require('../config/jwt');
const { pool } = require('../config/db');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const [rows] = await pool.query(
      'SELECT user_id, email, role FROM users WHERE user_id = ?',
      [decoded.userId]
    );

    if (!rows.length) {
      throw new AppError(401, 'User not found');
    }

    req.user = {
      userId: rows[0].user_id,
      email: rows[0].email,
      role: rows[0].role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError(401, 'Invalid or expired token'));
    }

    return next(error);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError(401, 'Authentication required'));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError(403, 'Access denied for this role'));
  }

  return next();
};

module.exports = { protect, authorize };
