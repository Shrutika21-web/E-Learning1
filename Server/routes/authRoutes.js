const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { loginValidationRules, registerValidationRules, validate } = require('../validators/authValidator');

// POST /auth/login
router.post('/login', loginValidationRules, validate, authController.login);
router.post('/register', registerValidationRules, validate, authController.register);

module.exports = router;
