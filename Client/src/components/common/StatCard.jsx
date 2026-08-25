export function StatCard({ icon: Icon, label, value, tone = 'gold' }) {
  const bg = { gold: 'var(--gold-100)', teal: 'var(--teal-100)', blue: 'var(--blue-100)', red: 'var(--red-100)' }[tone];
  const fg = { gold: 'var(--gold-700)', teal: 'var(--teal-600)', blue: 'var(--blue-600)', red: 'var(--red-600)' }[tone];

  return (
    <div className="card stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className="stat-icon" style={{ background: bg, color: fg }}>
          <Icon size={17} />
        </span>
      </div>
      <span className="stat-value">{value}</span>
    </div>
  );
}
