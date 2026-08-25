const videoService = require('../services/videoService');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * GET /video/all-videos  (admin)
 * Optional query param: courseId
 */
const getAllVideos = asyncHandler(async (req, res) => {
  const { courseId } = req.query;
  const videos = await videoService.getAllVideos(courseId);
  return success(res, 200, 'Videos retrieved successfully', { videos });
});

/**
 * POST /video/add  (admin)
 */
const addVideo = asyncHandler(async (req, res) => {
  const { courseId, title, description, youtubeURL } = req.body;
  const video = await videoService.addVideo({ courseId, title, description, youtubeURL });
  return success(res, 201, 'Video created successfully', { video });
});

/**
 * PUT /video/update/:videoId  (admin)
 */
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { courseId, title, description, youtubeURL } = req.body;
  const video = await videoService.updateVideo(videoId, { courseId, title, description, youtubeURL });
  return success(res, 200, 'Video updated successfully', { video });
});

/**
 * DELETE /video/delete/:videoId  (admin)
 */
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  await videoService.deleteVideo(videoId);
  return success(res, 200, 'Video deleted successfully');
});

module.exports = { getAllVideos, addVideo, updateVideo, deleteVideo };
