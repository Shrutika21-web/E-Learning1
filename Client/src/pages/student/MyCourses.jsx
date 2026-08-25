import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/Badge';
import { SkeletonGrid } from '../../components/common/Skeleton';
import { EmptyState, ErrorState } from '../../components/common/StatePanels';
import * as studentApi from '../../api/studentApi';
import { formatDate } from '../../utils/formatDate';
import { formatFees } from '../../utils/currency';
import { InboxIcon, PlayCircleIcon, CalendarIcon } from '../../components/common/Icons';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  const load = () => {
    setStatus('loading');
    studentApi
      .getMyCourses()
      .then((data) => {
        setCourses(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  return (
    <div>
      <PageHeader title="My Courses" description="Every course you're enrolled in and its current status." />

      {status === 'loading' && <SkeletonGrid count={4} />}
      {status === 'error' && <ErrorState description="Could not load your courses." onRetry={load} />}
      {status === 'ready' && courses.length === 0 && (
        <EmptyState
          icon={InboxIcon}
          title="You haven't enrolled in any courses yet"
          description="Browse available courses and enroll to start learning."
          action={<Button variant="gold" onClick={() => navigate('/student/courses')}>Explore Courses</Button>}
        />
      )}
      {status === 'ready' && courses.length > 0 && (
        <div className="course-grid">
          {courses.map((c) => (
            <div key={c.courseId} className="card course-card">
              <div className="course-card-top">
                <div className="row between" style={{ marginBottom: 8 }}>
                  <span className="eyebrow">Enrolled</span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="course-card-name">{c.courseName}</h3>
                <p className="course-card-desc">{c.description || 'No description provided for this course.'}</p>
              </div>
              <div className="course-card-body">
                <div className="course-meta-grid">
                  <div>
                    <div className="k">
                      <CalendarIcon size={11} style={{ marginRight: 3, verticalAlign: -2 }} />
                      Enrolled
                    </div>
                    <div className="v">{formatDate(c.enrolledAt)}</div>
                  </div>
                  <div>
                    <div className="k">Ends</div>
                    <div className="v">{formatDate(c.endDate)}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div className="k">Fees</div>
                    <div className="course-fee">{formatFees(c.fees)}</div>
                  </div>
                </div>
                <Button variant="primary" icon={PlayCircleIcon} onClick={() => navigate('/student/learning')}>
                  Start Learning
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
