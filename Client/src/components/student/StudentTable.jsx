import { formatDate } from '../../utils/formatDate';
import { StatusBadge } from '../common/Badge';
import { SkeletonTableRows } from '../common/Skeleton';

export function StudentTable({ students, loading }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Reg No.</th>
            <th>Student</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Course</th>
            <th>Enrolled</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonTableRows rows={6} cols={7} />
          ) : (
            students.map((s) => (
              <tr key={`${s.regNo}-${s.courseId}`}>
                <td className="mono">REG-{String(s.regNo).padStart(4, '0')}</td>
                <td style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{s.name}</td>
                <td className="mono">{s.email}</td>
                <td className="mono">{s.mobileNo}</td>
                <td>{s.courseName}</td>
                <td className="mono">{formatDate(s.enrolledAt)}</td>
                <td>
                  <StatusBadge status={s.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
