import { createPortal } from 'react-dom';
import { useToast } from '../../hooks/useToast';
import { CheckCircleIcon, AlertCircleIcon, InfoIcon, XIcon } from './Icons';

const ICONS = { success: CheckCircleIcon, error: AlertCircleIcon, info: InfoIcon };
const COLORS = { success: 'var(--teal-600)', error: '#e2665f', info: 'var(--gold-400)' };

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return createPortal(
    <div className="toast-viewport">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || InfoIcon;
        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <Icon size={17} style={{ color: COLORS[t.type], flexShrink: 0, marginTop: 1 }} />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 0 }}
              aria-label="Dismiss"
            >
              <XIcon size={14} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
