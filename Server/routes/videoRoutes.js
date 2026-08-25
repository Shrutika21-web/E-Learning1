const express = require('express');
const router = express.Router();

const videoController = require('../controllers/videoController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  validate,
  addVideoValidationRules,
  updateVideoValidationRules,
  videoIdParamValidationRules,
  courseIdQueryValidationRules,
} = require('../validators/videoValidator');

// All video routes require admin authentication.
router.use(authenticate, authorize('admin'));

// GET /video/all-videos
router.get('/all-videos', courseIdQueryValidationRules, validate, videoController.getAllVideos);

// POST /video/add
router.post('/add', addVideoValidationRules, validate, videoController.addVideo);

// PUT /video/update/:videoId
router.put('/update/:videoId', updateVideoValidationRules, validate, videoController.updateVideo);

// DELETE /video/delete/:videoId
router.delete('/delete/:videoId', videoIdParamValidationRules, validate, videoController.deleteVideo);

module.exports = router;
