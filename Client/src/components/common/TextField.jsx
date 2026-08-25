export function TextField({ label, error, hint, id, className = '', ...rest }) {
  const fieldId = id || rest.name;
  return (
    <div className="field">
      {label && <label htmlFor={fieldId}>{label}</label>}
      <input id={fieldId} className={`input ${error ? 'has-error' : ''} ${className}`} {...rest} />
      {error ? <span className="field-error">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}

export function TextareaField({ label, error, hint, id, className = '', ...rest }) {
  const fieldId = id || rest.name;
  return (
    <div className="field">
      {label && <label htmlFor={fieldId}>{label}</label>}
      <textarea id={fieldId} className={`textarea ${error ? 'has-error' : ''} ${className}`} {...rest} />
      {error ? <span className="field-error">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}

export function SelectField({ label, error, hint, id, children, className = '', ...rest }) {
  const fieldId = id || rest.name;
  return (
    <div className="field">
      {label && <label htmlFor={fieldId}>{label}</label>}
      <select id={fieldId} className={`select ${error ? 'has-error' : ''} ${className}`} {...rest}>
        {children}
      </select>
      {error ? <span className="field-error">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}
