import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/StatePanels';
import * as courseApi from '../../api/courseApi';
import * as adminApi from '../../api/adminApi';
import { formatDate, isCourseActiveByDates } from '../../utils/formatDate';
import { formatFees } from '../../utils/currency';
import { useAuth } from '../../hooks/useAuth';
import { BookIcon, UsersIcon, LayersIcon, PlusIcon, VideoIcon, AwardIcon, KeyIcon } from '../../components/common/Icons';

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('loading');
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = () => {
    setStatus('loading');
    Promise.all([courseApi.getAllCourses(), adminApi.getEnrolledStudents()])
      .then(([c, s]) => {
        setCourses(c);
        setStudents(s);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  const stats = useMemo(() => {
    const activeCourses = courses.filter((c) => isCourseActiveByDates(c.startDate, c.endDate)).length;
    const uniqueStudents = new Set(students.map((s) => s.regNo)).size;
    return {
      totalCourses: courses.length,
      activeCourses,
      totalEnrollments: students.length,
      totalStudents: uniqueStudents,
    };
  }, [courses, students]);

  const recentCourses = [...courses].slice(-5).reverse();
  const recentEnrollments = [...students]
    .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
    .slice(0, 5);

  const distribution = useMemo(() => {
    const counts = {};
    for (const s of students) counts[s.courseName] = (counts[s.courseName] || 0) + 1;
    const max = Math.max(1, ...Object.values(counts));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / max) * 100) }));
  }, [students]);

  if (status === 'error') {
    return <ErrorState description="Could not load dashboard data." onRetry={load} />;
  }

  return (
    <div>
      <PageHeader title={`Welcome back, Admin`} description={user?.email} />

      <div className="stat-grid">
        {status === 'loading'
          ? Array.from({ length: 4 }).map((_, i) => <Card key={i}><Skeleton height={60} /></Card>)
          : (
            <>
              <StatCard icon={BookIcon} label="Total Courses" value={stats.totalCourses} tone="gold" />
              <StatCard icon={AwardIcon} label="Active Courses" value={stats.activeCourses} tone="teal" />
              <StatCard icon={LayersIcon} label="Total Enrollments" value={stats.totalEnrollments} tone="blue" />
              <StatCard icon={UsersIcon} label="Total Students" value={stats.totalStudents} tone="red" />
            </>
          )}
      </div>

      <div className="row gap-md" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
        <Button variant="primary" icon={PlusIcon} onClick={() => navigate('/admin/courses')}>
          Add Course
        </Button>
        <Button variant="outline" icon={VideoIcon} onClick={() => navigate('/admin/videos')}>
          Add Video
        </Button>
        <Button variant="outline" icon={UsersIcon} onClick={() => navigate('/admin/students')}>
          View Students
        </Button>
        <Button variant="outline" icon={KeyIcon} onClick={() => navigate('/admin/admins')}>
          Add Admin
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }} className="dash-grid-responsive">
        <Card>
          <div className="row between" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16 }}>Recent courses</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/courses')}>View all</Button>
          </div>
          {status === 'loading' && <Skeleton height={140} />}
          {status === 'ready' && recentCourses.length === 0 && <p className="muted" style={{ fontSize: 13.5 }}>No courses yet.</p>}
          {status === 'ready' && (
            <div className="stack gap-sm">
              {recentCourses.map((c) => (
                <div key={c.courseId} className="row between" style={{ padding: '10px 0', borderBottom: '1px solid var(--steel-100)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.courseName}</div>
                    <div className="muted mono" style={{ fontSize: 12 }}>{formatDate(c.startDate)} – {formatDate(c.endDate)}</div>
                  </div>
                  <div className="row gap-sm">
                    <span className="mono" style={{ fontSize: 13 }}>{formatFees(c.fees)}</span>
                    {isCourseActiveByDates(c.startDate, c.endDate) ? (
                      <StatusBadge status="active" />
                    ) : (
                      <StatusBadge status="cancelled" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Course distribution</h3>
          {status === 'loading' && <Skeleton height={140} />}
          {status === 'ready' && distribution.length === 0 && <p className="muted" style={{ fontSize: 13.5 }}>No enrollments yet.</p>}
          {status === 'ready' && (
            <div className="stack gap-md">
              {distribution.map((d) => (
                <div key={d.name}>
                  <div className="row between" style={{ fontSize: 12.8, marginBottom: 5 }}>
                    <span>{d.name}</span>
                    <span className="mono muted">{d.count}</span>
                  </div>
                  <div style={{ height: 7, background: 'var(--steel-100)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${d.pct}%`, background: 'var(--gold-500)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card style={{ marginTop: 20 }}>
        <div className="row between" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 16 }}>Recent enrollments</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/students')}>View all</Button>
        </div>
        {status === 'loading' && <Skeleton height={100} />}
        {status === 'ready' && recentEnrollments.length === 0 && <p className="muted" style={{ fontSize: 13.5 }}>No enrollments yet.</p>}
        {status === 'ready' && recentEnrollments.length > 0 && (
          <div className="stack gap-sm">
            {recentEnrollments.map((s, i) => (
              <div key={i} className="row between" style={{ padding: '9px 0', borderBottom: '1px solid var(--steel-100)' }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 13.8 }}>{s.name}</span>
                  <span className="muted" style={{ fontSize: 13, marginLeft: 8 }}>enrolled in {s.courseName}</span>
                </div>
                <span className="mono muted" style={{ fontSize: 12.5 }}>{formatDate(s.enrolledAt)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
