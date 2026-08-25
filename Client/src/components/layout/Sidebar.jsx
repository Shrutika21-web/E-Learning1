import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  GraduationCapIcon,
  LayoutIcon,
  BookIcon,
  VideoIcon,
  UsersIcon,
  GraduationCapIcon as CoursesIcon,
  LayersIcon,
  KeyIcon,
  LogOutIcon,
} from '../common/Icons';

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutIcon, end: true },
  { to: '/admin/courses', label: 'Courses', icon: BookIcon },
  { to: '/admin/videos', label: 'Videos', icon: VideoIcon },
  { to: '/admin/students', label: 'Enrolled Students', icon: UsersIcon },
  { to: '/admin/admins', label: 'Manage Admins', icon: KeyIcon },
];

const STUDENT_LINKS = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutIcon, end: true },
  { to: '/student/courses', label: 'Available Courses', icon: CoursesIcon },
  { to: '/student/my-courses', label: 'My Courses', icon: LayersIcon },
  { to: '/student/learning', label: 'My Learning', icon: VideoIcon },
  { to: '/student/change-password', label: 'Change Password', icon: KeyIcon },
];

export function Sidebar({ mobileOpen, onCloseMobile }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? ADMIN_LINKS : STUDENT_LINKS;
  const initials = (user?.name || user?.email || '?').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}
      <aside className={`dash-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">
            <GraduationCapIcon size={18} />
          </span>
          EduManage
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">{isAdmin ? 'Administration' : 'Learning'}</div>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobile}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="avatar">{initials}</span>
            <div className="sidebar-user-info">
              <div className="name">{user?.name || user?.email}</div>
              <div className="role">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', marginTop: 6 }}
          >
            <LogOutIcon size={17} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
