import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CourseCard } from '../components/course/CourseCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import { EmptyState, ErrorState } from '../components/common/StatePanels';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import * as courseApi from '../api/courseApi';
import { ArrowRightIcon, BookIcon, VideoIcon, AwardIcon, ClockIcon, InboxIcon } from '../components/common/Icons';

const FEATURES = [
  { icon: BookIcon, title: 'Structured Learning', desc: 'Courses organized into clear modules with defined start and end windows.' },
  { icon: VideoIcon, title: 'Video-Based Courses', desc: 'Learn from curated YouTube lessons attached directly to each course.' },
  { icon: AwardIcon, title: 'Track Your Progress', desc: 'See every course you have enrolled in and its current status at a glance.' },
  { icon: ClockIcon, title: 'Learn Anytime', desc: 'Revisit lessons any time within your course\u2019s video access window.' },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const load = () => {
    setStatus('loading');
    courseApi
      .getAllActiveCourses()
      .then((data) => {
        setCourses(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  const handleEnrollClick = () => {
    navigate(isAuthenticated ? '/student/courses' : '/login');
  };

  return (
    <div>
      <Navbar />

      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow" style={{ color: 'var(--gold-400)' }}>EduManage</span>
          <h1 style={{ marginTop: 12 }}>Learn. Grow. Succeed.</h1>
          <p className="lead">
            Build your skills with structured courses, expert content, and flexible learning designed around
            real course timelines and video access windows.
          </p>
          <div className="hero-actions">
            <Button variant="gold" onClick={() => navigate('/courses')} icon={ArrowRightIcon}>
              Explore Courses
            </Button>
          </div>

          <div className="hero-ledger">
            <div className="hero-ledger-cell">
              <div className="n">{status === 'ready' ? courses.length : '—'}</div>
              <div className="l">Active courses open now</div>
            </div>
            <div className="hero-ledger-cell">
              <div className="n">180+</div>
              <div className="l">Days of typical video access</div>
            </div>
            <div className="hero-ledger-cell">
              <div className="n">100%</div>
              <div className="l">Structured, self-paced learning</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why EduManage</span>
            <h2 style={{ marginTop: 8 }}>Everything you need to actually finish a course</h2>
            <p style={{ marginTop: 8 }}>No clutter — a course, its videos, and your progress through them.</p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="card feature-card">
                <div className="feature-icon">
                  <f.icon size={19} />
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head row between wrap" style={{ alignItems: 'flex-end' }}>
            <div>
              <span className="eyebrow">Open enrollment</span>
              <h2 style={{ marginTop: 8 }}>Active courses</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/courses')} icon={ArrowRightIcon}>
              View all courses
            </Button>
          </div>

          {status === 'loading' && <SkeletonGrid count={3} />}
          {status === 'error' && <ErrorState description="Could not load active courses right now." onRetry={load} />}
          {status === 'ready' && courses.length === 0 && (
            <EmptyState icon={InboxIcon} title="No active courses" description="Check back soon — new courses open for enrollment regularly." />
          )}
          {status === 'ready' && courses.length > 0 && (
            <div className="course-grid">
              {courses.slice(0, 3).map((c) => (
                <CourseCard
                  key={c.courseId}
                  course={c}
                  footer={
                    <Button variant="gold" block onClick={handleEnrollClick}>
                      Enroll
                    </Button>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
