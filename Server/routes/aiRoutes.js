const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { chatValidationRules, validate } = require('../validators/aiValidator');

router.post('/chat', authenticate, authorize('student'), chatValidationRules, validate, aiController.chat);

module.exports = router;