import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';

export function PasswordField({ label, error, hint, id, className = '', ...rest }) {
  const [visible, setVisible] = useState(false);
  const fieldId = id || rest.name;

  return (
    <div className="field">
      {label && <label htmlFor={fieldId}>{label}</label>}
      <div className="input-with-icon">
        <input
          id={fieldId}
          type={visible ? 'text' : 'password'}
          className={`input ${error ? 'has-error' : ''} ${className}`}
          {...rest}
        />
        <button
          type="button"
          className="input-icon-btn"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {visible ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
        </button>
      </div>
      {error ? <span className="field-error">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}
