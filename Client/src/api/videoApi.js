import api from './axios';

// GET /video/all-videos (admin, optional courseId query) -> { data: { videos } }
export function getAllVideos(courseId) {
  const params = courseId ? { courseId } : {};
  return api.get('/video/all-videos', { params }).then((res) => res.data.data.videos);
}

// POST /video/add (admin) -> { data: { video } }
export function addVideo(payload) {
  return api.post('/video/add', payload).then((res) => res.data.data.video);
}

// PUT /video/update/:videoId (admin) -> { data: { video } }
export function updateVideo(videoId, payload) {
  return api.put(`/video/update/${videoId}`, payload).then((res) => res.data.data.video);
}

// DELETE /video/delete/:videoId (admin) -> { message }
export function deleteVideo(videoId) {
  return api.delete(`/video/delete/${videoId}`).then((res) => res.data.message);
}
