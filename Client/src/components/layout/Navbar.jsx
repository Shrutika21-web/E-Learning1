import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { GraduationCapIcon, MenuIcon, XIcon } from '../common/Icons';

export function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const dashboardPath = isAdmin ? '/admin/dashboard' : '/student/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">
            <GraduationCapIcon size={18} />
          </span>
          EduManage
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Courses
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to={dashboardPath} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {user?.name || 'Dashboard'}
              </NavLink>
              <Button variant="outline" size="sm" onClick={handleLogout} style={{ marginLeft: 8 }}>
                Log out
              </Button>
            </>
          ) : (
              <Button variant="primary" size="sm" onClick={() => navigate('/student/login')} style={{ marginLeft: 8 }}>
              Login
            </Button>
          )}
        </nav>

        <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="container" style={{ paddingBottom: 16 }}>
          <div className="stack gap-xs">
            <NavLink to="/" end className="nav-link" onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/courses" className="nav-link" onClick={() => setOpen(false)}>
              Courses
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to={dashboardPath} className="nav-link" onClick={() => setOpen(false)}>
                  {user?.name || 'Dashboard'}
                </NavLink>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={() => { setOpen(false); navigate('/student/login'); }}>
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
