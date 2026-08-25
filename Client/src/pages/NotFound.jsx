import { Link } from 'react-router-dom';
import { FileQuestionIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="row center" style={{ minHeight: '100vh', background: 'var(--paper-50)' }}>
      <div style={{ textAlign: 'center', maxWidth: 380, padding: 24 }}>
        <div className="state-icon" style={{ margin: '0 auto 20px' }}>
          <FileQuestionIcon size={28} />
        </div>
        <span className="eyebrow">404</span>
        <h1 style={{ marginTop: 8, marginBottom: 10 }}>Page not found</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/">
          <Button variant="primary">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
