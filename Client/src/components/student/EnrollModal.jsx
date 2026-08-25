import { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { TextField } from '../common/TextField';
import { validateEnrollment, hasErrors } from '../../utils/validators';
import { formatFees } from '../../utils/currency';

const EMPTY = { name: '', mobileNo: '' };

export function EnrollModal({ open, onClose, onSubmit, submitting, course, serverErrors = {} }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setValues(EMPTY);
      setErrors({});
    }
  }, [open, course]);

  useEffect(() => {
    setErrors((prev) => ({ ...prev, ...serverErrors }));
  }, [serverErrors]);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateEnrollment(values);
    setErrors(validation);
    if (hasErrors(validation)) return;
    onSubmit({ name: values.name.trim(), mobileNo: values.mobileNo.trim() });
  };

  if (!course) return null;

  return (
    <Modal open={open} onClose={onClose} title="Confirm enrollment" maxWidth={440}>
      <div className="card" style={{ background: 'var(--paper-50)', border: 'none', padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ fontWeight: 700, color: 'var(--ink-900)', fontSize: 15 }}>{course.courseName}</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{formatFees(course.fees)} · {course.videoExpireDays} days video access</div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Full name"
          name="name"
          value={values.name}
          onChange={set('name')}
          error={errors.name}
          maxLength={100}
          placeholder="As you'd like it on your enrollment record"
        />
        <TextField
          label="Mobile number"
          name="mobileNo"
          value={values.mobileNo}
          onChange={set('mobileNo')}
          error={errors.mobileNo}
          maxLength={10}
          inputMode="numeric"
          placeholder="10-digit mobile number"
        />

        <div className="row gap-sm" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
          <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="gold" type="submit" loading={submitting}>
            Confirm enrollment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
