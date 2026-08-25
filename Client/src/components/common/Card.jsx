export function Card({ children, padded = true, className = '', ...rest }) {
  return (
    <div className={`card ${padded ? 'card-pad' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}
