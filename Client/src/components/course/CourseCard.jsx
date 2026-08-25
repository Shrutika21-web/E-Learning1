import { formatDate, isCourseActiveByDates } from '../../utils/formatDate';
import { formatFees } from '../../utils/currency';
import { CalendarIcon, ClockIcon } from '../common/Icons';
import { Badge } from '../common/Badge';

export function CourseCard({ course, footer }) {
  const active = isCourseActiveByDates(course.startDate, course.endDate);

  return (
    <div className="card course-card">
      <div className="course-card-top">
        <div className="row between" style={{ marginBottom: 8 }}>
          <span className="eyebrow">{active ? 'Enrolling now' : 'Not open for enrollment'}</span>
          {active ? <Badge tone="teal" dot>Active</Badge> : <Badge tone="steel">Closed</Badge>}
        </div>
        <h3 className="course-card-name">{course.courseName}</h3>
        <p className="course-card-desc">{course.description || 'No description provided for this course.'}</p>
      </div>
      <div className="course-card-body">
        <div className="course-meta-grid">
          <div>
            <div className="k">
              <CalendarIcon size={11} style={{ marginRight: 3, verticalAlign: -2 }} />
              Starts
            </div>
            <div className="v">{formatDate(course.startDate)}</div>
          </div>
          <div>
            <div className="k">Ends</div>
            <div className="v">{formatDate(course.endDate)}</div>
          </div>
          <div>
            <div className="k">
              <ClockIcon size={11} style={{ marginRight: 3, verticalAlign: -2 }} />
              Video access
            </div>
            <div className="v">{course.videoExpireDays} days</div>
          </div>
          <div>
            <div className="k">Fees</div>
            <div className="course-fee">{formatFees(course.fees)}</div>
          </div>
        </div>
        {footer && <div className="course-card-actions">{footer}</div>}
      </div>
    </div>
  );
}
