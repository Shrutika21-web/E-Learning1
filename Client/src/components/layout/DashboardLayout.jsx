import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MenuIcon } from '../common/Icons';
import { CourseAssistant } from '../student/CourseAssistant';
import { useAuth } from '../../hooks/useAuth';

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isStudent } = useAuth();

  return (
    <div className="dash-shell">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="dash-main">
        <div className="dash-topbar">
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <MenuIcon size={22} />
          </button>
          <span className="eyebrow">EduManage</span>
          <span />
        </div>
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
      {isStudent && <CourseAssistant />}
    </div>
  );
}
