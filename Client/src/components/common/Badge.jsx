export function Badge({ children, tone = 'steel', dot = false, className = '', style, ...rest }) {
  return (
    <span className={`badge badge-${tone} ${className}`} style={style} {...rest}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

const STATUS_TONE = {
  active: 'teal',
  completed: 'blue',
  cancelled: 'red',
};

export function StatusBadge({ status }) {
  const tone = STATUS_TONE[status] || 'steel';
  return (
    <Badge tone={tone} dot>
      {status || 'unknown'}
    </Badge>
  );
}
