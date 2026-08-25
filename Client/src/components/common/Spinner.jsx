export function Spinner({ size = 18, dark = false, className = '' }) {
  return (
    <span
      className={`spinner ${dark ? 'spinner-dark' : ''} ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
