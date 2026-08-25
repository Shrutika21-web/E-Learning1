export function Skeleton({ width = '100%', height = 16, radius, className = '', style = {} }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ display: 'block', width, height, borderRadius: radius, ...style }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card card-pad stack gap-md">
      <Skeleton height={18} width="60%" />
      <Skeleton height={13} width="90%" />
      <Skeleton height={13} width="75%" />
      <div className="row gap-sm" style={{ marginTop: 6 }}>
        <Skeleton height={34} width="48%" radius={8} />
        <Skeleton height={34} width="48%" radius={8} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="course-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTableRows({ rows = 5, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c}>
              <Skeleton height={13} width={c === 0 ? '60%' : '80%'} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
