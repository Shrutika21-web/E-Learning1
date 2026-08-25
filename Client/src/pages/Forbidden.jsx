import { Link } from 'react-router-dom';
import { ShieldAlertIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

export default function Forbidden() {
  const { isAdmin } = useAuth();
  return (
    <div className="row center" style={{ minHeight: '100vh', background: 'var(--paper-50)' }}>
      <div style={{ textAlign: 'center', maxWidth: 380, padding: 24 }}>
        <div className="state-icon" style={{ margin: '0 auto 20px', color: 'var(--red-600)', background: 'var(--red-100)' }}>
          <ShieldAlertIcon size={28} />
        </div>
        <span className="eyebrow">403</span>
        <h1 style={{ marginTop: 8, marginBottom: 10 }}>Access denied</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          You don't have permission to view this page.
        </p>
        <Link to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}>
          <Button variant="primary">Go to my dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
