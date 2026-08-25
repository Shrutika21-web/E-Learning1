import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState, EmptyState } from '../../components/common/StatePanels';
import * as studentApi from '../../api/studentApi';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';
import { formatFees } from '../../utils/currency';
import { LayersIcon, BookIcon, VideoIcon, AwardIcon, ArrowRightIcon, InboxIcon } from '../../components/common/Icons';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const { user } = useAuth();
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

  const stats = useMemo(() => {
    const active = courses.filter((c) => c.status === 'active').length;
    return {
      myCourses: courses.length,
      activeCourses: active,
    };
  }, [courses]);

  if (status === 'error') return <ErrorState description="Could not load your dashboard." onRetry={load} />;

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name || 'back'}!`} description={user?.email} />

      <div className="stat-grid">
        {status === 'loading' ? (
          Array.from({ length: 3 }).map((_, i) => <Card key={i}><Skeleton height={60} /></Card>)
        ) : (
          <>
            <StatCard icon={LayersIcon} label="My Courses" value={stats.myCourses} tone="gold" />
            <StatCard icon={AwardIcon} label="Active Courses" value={stats.activeCourses} tone="teal" />
            <StatCard icon={VideoIcon} label="Learning Status" value={stats.activeCourses > 0 ? 'In progress' : 'Not started'} tone="blue" />
          </>
        )}
      </div>

      <div className="row gap-md" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
        <Button variant="primary" icon={BookIcon} onClick={() => navigate('/student/courses')}>
          Browse Available Courses
        </Button>
        <Button variant="outline" icon={VideoIcon} onClick={() => navigate('/student/learning')}>
          Go to My Learning
        </Button>
      </div>

      <Card>
        <div className="row between" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 16 }}>Your enrolled courses</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/student/my-courses')} icon={ArrowRightIcon}>
            View all
          </Button>
        </div>

        {status === 'loading' && <Skeleton height={140} />}
        {status === 'ready' && courses.length === 0 && (
          <EmptyState
            icon={InboxIcon}
            title="You haven't enrolled in any courses yet"
            description="Explore available courses and enroll to start learning."
            action={<Button variant="gold" onClick={() => navigate('/student/courses')}>Explore Courses</Button>}
          />
        )}
        {status === 'ready' && courses.length > 0 && (
          <div className="stack gap-sm">
            {courses.slice(0, 5).map((c) => (
              <div key={c.courseId} className="row between" style={{ padding: '10px 0', borderBottom: '1px solid var(--steel-100)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.courseName}</div>
                  <div className="muted mono" style={{ fontSize: 12 }}>Enrolled {formatDate(c.enrolledAt)}</div>
                </div>
                <div className="row gap-sm">
                  <span className="mono" style={{ fontSize: 13 }}>{formatFees(c.fees)}</span>
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
