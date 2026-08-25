import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { TextField } from '../../components/common/TextField';
import { PasswordField } from '../../components/common/PasswordField';
import { Button } from '../../components/common/Button';
import { GraduationCapIcon } from '../../components/common/Icons';
import { validateRegistration, hasErrors } from '../../utils/validators';
import { extractErrorMessage, extractFieldErrors } from '../../api/axios';

const EMPTY = { fullName: '', email: '', password: '', confirmPassword: '' };

export default function Register() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const set = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateRegistration(values);
    setErrors(validation);
    if (hasErrors(validation)) return;
    setSubmitting(true);
    try {
      await register({ ...values, fullName: values.fullName.trim(), email: values.email.trim() });
      toast.success('Registration successful');
      navigate('/student/courses', { replace: true });
    } catch (error) {
      setErrors(extractFieldErrors(error));
      if (!Object.keys(extractFieldErrors(error)).length) toast.error(extractErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <Link to="/" className="brand" style={{ color: '#fff' }}>
          <span className="brand-mark"><GraduationCapIcon size={18} /></span>
          EduManage
        </Link>
        <div className="auth-side-quote">Start with a course that moves your curiosity forward.<div className="attr">— The EduManage team</div></div>
      </div>
      <div className="auth-form-col">
        <div className="auth-card">
          <h1>Create your student account</h1>
          <p className="lead">Register once, then browse courses and lessons before you enroll.</p>
          <form onSubmit={handleSubmit} noValidate>
            <TextField label="Full name" name="fullName" autoComplete="name" value={values.fullName} onChange={set('fullName')} error={errors.fullName} placeholder="Your full name" />
            <TextField label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
            <PasswordField label="Password" name="password" autoComplete="new-password" value={values.password} onChange={set('password')} error={errors.password} placeholder="At least 6 characters" />
            <PasswordField label="Confirm password" name="confirmPassword" autoComplete="new-password" value={values.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} placeholder="Repeat your password" />
            <Button type="submit" variant="primary" block loading={submitting}>Create account</Button>
          </form>
          <p className="auth-switch">Already registered? <Link to="/student/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
