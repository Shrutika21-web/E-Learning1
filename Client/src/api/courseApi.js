import api from './axios';

// GET /course/all-active-courses (public) -> { data: { courses } }
export function getAllActiveCourses() {
  return api.get('/course/all-active-courses').then((res) => res.data.data.courses);
}

// GET /course/:courseId (public active course) -> { data: { course } }
export function getActiveCourseWithVideos(courseId) {
  return api.get(`/course/${courseId}`).then((res) => res.data.data.course);
}

// GET /course/all-courses (admin, optional startDate/endDate query) -> { data: { courses } }
export function getAllCourses(params = {}) {
  return api.get('/course/all-courses', { params }).then((res) => res.data.data.courses);
}

// POST /course/add (admin) -> { data: { course } }
export function addCourse(payload) {
  return api.post('/course/add', payload).then((res) => res.data.data.course);
}

// PUT /course/update/:courseId (admin) -> { data: { course } }
export function updateCourse(courseId, payload) {
  return api.put(`/course/update/${courseId}`, payload).then((res) => res.data.data.course);
}

// DELETE /course/delete/:courseId (admin) -> { message }
export function deleteCourse(courseId) {
  return api.delete(`/course/delete/${courseId}`).then((res) => res.data.message);
}
