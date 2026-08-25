import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { TextField } from '../components/common/TextField';
import { PasswordField } from '../components/common/PasswordField';
import { Button } from '../components/common/Button';
import { validateLogin, hasErrors } from '../utils/validators';
import { extractErrorMessage } from '../api/axios';
import { GraduationCapIcon } from '../components/common/Icons';

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isStudentLogin = location.pathname === '/student/login';

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateLogin(values);
    setErrors(validation);
    if (hasErrors(validation)) return;

    setSubmitting(true);
    try {
      const user = await login(values.email.trim(), values.password);
      toast.success('Login successful');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/courses');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <Link to="/" className="brand" style={{ color: '#fff' }}>
          <span className="brand-mark">
            <GraduationCapIcon size={18} />
          </span>
          EduManage
        </Link>
        <div className="auth-side-quote">
          “Structured learning turns curiosity into a completed course, not a stalled tab.”
          <div className="attr">— The EduManage team</div>
        </div>
      </div>

      <div className="auth-form-col">
        <div className="auth-card">
          <h1>{isStudentLogin ? 'Student login' : 'Welcome back'}</h1>
          <p className="lead">Log in to continue your courses.</p>

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={set('email')}
              error={errors.email}
              placeholder="you@example.com"
            />
            <PasswordField
              label="Password"
              name="password"
              autoComplete="current-password"
              value={values.password}
              onChange={set('password')}
              error={errors.password}
              placeholder="••••••••"
            />
            <Button type="submit" variant="primary" block loading={submitting}>
              Log in
            </Button>
          </form>
          {isStudentLogin && <p className="auth-switch">New student? <Link to="/student/register">Create an account</Link></p>}

        </div>
      </div>
    </div>
  );
}
