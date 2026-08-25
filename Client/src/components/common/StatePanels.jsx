import { InboxIcon, AlertCircleIcon } from './Icons';
import { Button } from './Button';

export function EmptyState({ icon: Icon = InboxIcon, title, description, action }) {
  return (
    <div className="state-panel">
      <div className="state-icon">
        <Icon size={26} />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="state-panel">
      <div className="state-icon" style={{ color: 'var(--red-600)', background: 'var(--red-100)' }}>
        <AlertCircleIcon size={26} />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {onRetry && (
        <div style={{ marginTop: 18 }}>
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
