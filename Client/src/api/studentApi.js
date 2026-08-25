import api from './axios';

// POST /student/register-to-course (student)
// The backend's validator requires name + mobileNo in the body even though
// the service only ever trusts req.user (JWT) for identity — courseId is
// the only field that actually determines the enrollment.
// -> { data: { enrollment } }
export function registerToCourse({ courseId, name, mobileNo }) {
  return api
    .post('/student/register-to-course', { courseId, name, mobileNo })
    .then((res) => res.data.data.enrollment);
}

// PUT /student/change-password (student) -> { message }
export function changePassword({ newPassword, confirmPassword }) {
  return api.put('/student/change-password', { newPassword, confirmPassword }).then((res) => res.data.message);
}

// GET /student/my-courses (student) -> { data: { courses } }
export function getMyCourses() {
  return api.get('/student/my-courses').then((res) => res.data.data.courses);
}

// GET /student/my-course-with-videos (student) -> { courses }  (NOT wrapped in `data`)
export function getMyCoursesWithVideos() {
  return api.get('/student/my-course-with-videos').then((res) => res.data.courses);
}
