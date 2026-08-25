const aiService = require('../services/aiService');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorMiddleware');

const chat = asyncHandler(async (req, res) => {
  const { question, currentCourse } = req.body;
  const result = await aiService.chat({ question, currentCourse });
  return success(res, 200, 'Assistant response generated', result);
});

module.exports = { chat };