import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircleIcon } from './Icons';

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Delete',
  loading = false,
  danger = true,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth={420}>
      <div className="row gap-md" style={{ alignItems: 'flex-start', marginBottom: 22 }}>
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: danger ? 'var(--red-100)' : 'var(--amber-100)',
            color: danger ? 'var(--red-600)' : 'var(--amber-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertCircleIcon size={19} />
        </span>
        <p className="muted" style={{ fontSize: 14, paddingTop: 4 }}>{description}</p>
      </div>
      <div className="row gap-sm" style={{ justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
