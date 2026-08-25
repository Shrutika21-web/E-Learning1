import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../common/Spinner';

function FullScreenLoader() {
  return (
    <div className="row center" style={{ minHeight: '100vh' }}>
      <Spinner size={26} dark />
    </div>
  );
}

/** Requires any authenticated user; otherwise redirects to /login. */
export function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return <FullScreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Requires role === 'admin'; students get bounced to their own dashboard. */
export function AdminRoute() {
  const { isAdmin, isStudent, initializing } = useAuth();
  if (initializing) return <FullScreenLoader />;
  if (isStudent) return <Navigate to="/student/dashboard" replace />;
  if (!isAdmin) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Requires role === 'student'; admins get bounced to their own dashboard. */
export function StudentRoute() {
  const { isAdmin, isStudent, initializing } = useAuth();
  if (initializing) return <FullScreenLoader />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (!isStudent) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Keeps already-logged-in users off the login page. */
export function GuestRoute() {
  const { isAuthenticated, isAdmin, initializing } = useAuth();
  if (initializing) return <FullScreenLoader />;
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin/dashboard' : '/student/dashboard'} replace />;
  return <Outlet />;
}
