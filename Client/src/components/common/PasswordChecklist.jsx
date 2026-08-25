import { CheckIcon } from './Icons';

export function PasswordChecklist({ password = '', confirmPassword = '' }) {
  const checks = [
    { label: 'At least 6 characters', met: password.length >= 6 },
    { label: 'Passwords match', met: password.length > 0 && password === confirmPassword },
  ];

  return (
    <div className="pw-checklist">
      {checks.map((c) => (
        <div key={c.label} className={`pw-check-item ${c.met ? 'met' : ''}`}>
          <span className="icon-circle">{c.met && <CheckIcon size={10} />}</span>
          {c.label}
        </div>
      ))}
    </div>
  );
}
