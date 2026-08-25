import { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TextField } from '../../components/common/TextField';
import { PasswordField } from '../../components/common/PasswordField';
import { useToast } from '../../hooks/useToast';
import { extractErrorMessage, extractFieldErrors } from '../../api/axios';
import * as adminApi from '../../api/adminApi';
import { validateAdminCreation, hasErrors } from '../../utils/validators';

const EMPTY = { email: '', password: '', confirmPassword: '' };

export default function ManageAdmins() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const set = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateAdminCreation(values);
    setErrors(validation);
    if (hasErrors(validation)) return;
    setSubmitting(true);
    try {
      await adminApi.createAdmin({ email: values.email.trim(), password: values.password, confirmPassword: values.confirmPassword });
      toast.success('Admin account created successfully');
      setValues(EMPTY);
      setErrors({});
    } catch (error) {
      const fieldErrors = extractFieldErrors(error);
      if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
      else toast.error(extractErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Manage Admins" description="Create another administrator account for the course management system." />
      <Card style={{ maxWidth: 520 }}>
        <h3 style={{ fontSize: 17, marginBottom: 18 }}>Create admin account</h3>
        <form onSubmit={handleSubmit} noValidate>
          <TextField label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} placeholder="admin@example.com" />
          <PasswordField label="Password" name="password" autoComplete="new-password" value={values.password} onChange={set('password')} error={errors.password} placeholder="At least 6 characters" />
          <PasswordField label="Confirm password" name="confirmPassword" autoComplete="new-password" value={values.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} placeholder="Repeat the password" />
          <Button type="submit" variant="primary" loading={submitting}>Create admin</Button>
        </form>
      </Card>
    </div>
  );
}
