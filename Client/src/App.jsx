import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ToastViewport } from './components/common/ToastViewport';
import { AdminRoute, StudentRoute, GuestRoute } from './components/layout/RouteGuards';
import { DashboardLayout } from './components/layout/DashboardLayout';

import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Register from './pages/student/Register';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageVideos from './pages/admin/ManageVideos';
import EnrolledStudents from './pages/admin/EnrolledStudents';
import ManageAdmins from './pages/admin/ManageAdmins';

import StudentDashboard from './pages/student/StudentDashboard';
import AvailableCourses from './pages/student/AvailableCourses';
import MyCourses from './pages/student/MyCourses';
import MyLearning from './pages/student/MyLearning';
import VideoLearning from './pages/student/VideoLearning';
import ChangePassword from './pages/student/ChangePassword';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetails />} />
            <Route path="/403" element={<Forbidden />} />

            {/* Guest-only */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/student/login" element={<Login />} />
              <Route path="/student/register" element={<Register />} />
            </Route>

            {/* Admin */}
            <Route element={<AdminRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/courses" element={<ManageCourses />} />
                <Route path="/admin/videos" element={<ManageVideos />} />
                <Route path="/admin/students" element={<EnrolledStudents />} />
                <Route path="/admin/admins" element={<ManageAdmins />} />
              </Route>
            </Route>

            {/* Student */}
            <Route element={<StudentRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/courses" element={<AvailableCourses />} />
                <Route path="/student/my-courses" element={<MyCourses />} />
                <Route path="/student/learning" element={<MyLearning />} />
                <Route path="/student/learning/:courseId/:videoId" element={<VideoLearning />} />
                <Route path="/student/change-password" element={<ChangePassword />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastViewport />
      </ToastProvider>
    </AuthProvider>
  );
}
