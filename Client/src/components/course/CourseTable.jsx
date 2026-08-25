import { formatDate, isCourseActiveByDates } from '../../utils/formatDate';
import { formatFees } from '../../utils/currency';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EditIcon, TrashIcon } from '../common/Icons';
import { SkeletonTableRows } from '../common/Skeleton';

export function CourseTable({ courses, loading, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Course Name</th>
            <th>Fees</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Video Access</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonTableRows rows={5} cols={8} />
          ) : (
            courses.map((c) => {
              const active = isCourseActiveByDates(c.startDate, c.endDate);
              return (
                <tr key={c.courseId}>
                  <td className="mono">#{c.courseId}</td>
                  <td style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{c.courseName}</td>
                  <td className="mono">{formatFees(c.fees)}</td>
                  <td className="mono">{formatDate(c.startDate)}</td>
                  <td className="mono">{formatDate(c.endDate)}</td>
                  <td className="mono">{c.videoExpireDays} days</td>
                  <td>{active ? <Badge tone="teal" dot>Active</Badge> : <Badge tone="steel">Closed</Badge>}</td>
                  <td>
                    <div className="table-actions">
                      <Button variant="ghost" size="sm" icon={EditIcon} onClick={() => onEdit(c)} aria-label="Edit course" />
                      <Button variant="ghost" size="sm" icon={TrashIcon} onClick={() => onDelete(c)} aria-label="Delete course" />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
