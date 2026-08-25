const authService = require('../services/authService');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * POST /auth/login
 * Response shape matches the project spec exactly:
 * { success, message, token, user: { userId, email, role } }
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { token, user } = await authService.login(email, password);

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user,
  });
});

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const { token, user } = await authService.register(fullName, email, password);
  return res.status(201).json({ success: true, message: 'Registration successful', token, user });
});

module.exports = { login, register };
