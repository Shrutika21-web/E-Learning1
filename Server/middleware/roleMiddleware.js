const { error } = require('../utils/response');

/**
 * Returns a middleware that only allows the request through if
 * req.user.role matches one of the allowed roles.
 * Must be used AFTER the `authenticate` middleware.
 *
 * Usage:
 *   router.post('/course/add', authenticate, authorize('admin'), courseController.addCourse);
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return error(res, 401, 'Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 403, `Access denied. This action requires role: ${allowedRoles.join(' or ')}`);
    }

    next();
  };
}

module.exports = { authorize };
