import { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { PasswordField } from '../../components/common/PasswordField';
import { PasswordChecklist } from '../../components/common/PasswordChecklist';
import { Button } from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import * as studentApi from '../../api/studentApi';
import { extractErrorMessage, extractFieldErrors } from '../../api/axios';
import { validateChangePassword, hasErrors } from '../../utils/validators';

export default function ChangePassword() {
  const [values, setValues] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateChangePassword(values);
    setErrors(validation);
    if (hasErrors(validation)) return;

    setSubmitting(true);
    try {
      await studentApi.changePassword(values);
      toast.success('Password changed successfully.');
      setValues({ newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors);
      } else {
        toast.error(extractErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Change Password" description="Update the password you use to log in." />

      <Card style={{ maxWidth: 440 }}>
        <form onSubmit={handleSubmit} noValidate>
          <PasswordField
            label="New password"
            name="newPassword"
            autoComplete="new-password"
            value={values.newPassword}
            onChange={set('newPassword')}
            error={errors.newPassword}
            placeholder="At least 6 characters"
          />
          <PasswordField
            label="Confirm new password"
            name="confirmPassword"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={set('confirmPassword')}
            error={errors.confirmPassword}
            placeholder="Re-enter your new password"
          />
          <PasswordChecklist password={values.newPassword} confirmPassword={values.confirmPassword} />
          <div style={{ marginTop: 22 }}>
            <Button type="submit" variant="primary" loading={submitting}>
              Update password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
