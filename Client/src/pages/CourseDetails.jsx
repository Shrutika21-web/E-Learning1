import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ErrorState } from '../components/common/StatePanels';
import { Skeleton } from '../components/common/Skeleton';
import { useAuth } from '../hooks/useAuth';
import * as courseApi from '../api/courseApi';
import { formatDate, isCourseActiveByDates } from '../utils/formatDate';
import { formatFees } from '../utils/currency';
import { CalendarIcon, ClockIcon, RupeeIcon } from '../components/common/Icons';
import { getYoutubeEmbedUrl } from '../utils/youtube';
import { CourseAssistant } from '../components/student/CourseAssistant';

export default function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState('loading');
  const { isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();

  const load = () => {
    setStatus('loading');
    courseApi.getActiveCourseWithVideos(courseId)
      .then((found) => { setCourse(found); setStatus('ready'); })
      .catch((err) => setStatus(err.response?.status === 404 ? 'not-found' : 'error'));
  };

  useEffect(load, [courseId]);

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 64, maxWidth: 760 }}>
        {status === 'loading' && (
          <div className="card card-pad stack gap-md">
            <Skeleton height={26} width="50%" />
            <Skeleton height={14} width="80%" />
            <Skeleton height={14} width="65%" />
          </div>
        )}

        {status === 'error' && <ErrorState description="Could not load this course right now." onRetry={load} />}

        {status === 'not-found' && (
          <ErrorState
            title="Course not available"
            description="This course isn't currently open for enrollment, or it doesn't exist."
          />
        )}

        {status === 'ready' && course && (
          <>
            <Link to="/courses" className="muted" style={{ fontSize: 13.5, marginBottom: 20, display: 'inline-block' }}>
              ← Back to all courses
            </Link>
            <div className="card card-pad">
              <div className="row between wrap gap-sm" style={{ marginBottom: 10 }}>
                <span className="eyebrow">Course details</span>
                {isCourseActiveByDates(course.startDate, course.endDate) ? (
                  <Badge tone="teal" dot>Open for enrollment</Badge>
                ) : (
                  <Badge tone="steel">Not currently open</Badge>
                )}
              </div>
              <h1 style={{ fontSize: 30, marginBottom: 12 }}>{course.courseName}</h1>
              <p className="muted" style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 26 }}>
                {course.description || 'No description provided for this course.'}
              </p>

              <div className="course-meta-grid" style={{ marginBottom: 28, gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px 24px' }}>
                <div>
                  <div className="k"><RupeeIcon size={11} style={{ marginRight: 3, verticalAlign: -2 }} />Fees</div>
                  <div className="course-fee">{formatFees(course.fees)}</div>
                </div>
                <div>
                  <div className="k"><ClockIcon size={11} style={{ marginRight: 3, verticalAlign: -2 }} />Video access</div>
                  <div className="v" style={{ fontSize: 16 }}>{course.videoExpireDays} days</div>
                </div>
                <div>
                  <div className="k"><CalendarIcon size={11} style={{ marginRight: 3, verticalAlign: -2 }} />Start date</div>
                  <div className="v" style={{ fontSize: 16 }}>{formatDate(course.startDate)}</div>
                </div>
                <div>
                  <div className="k">End date</div>
                  <div className="v" style={{ fontSize: 16 }}>{formatDate(course.endDate)}</div>
                </div>
              </div>

              <Button
                variant="gold"
                onClick={() => navigate(isAuthenticated ? '/student/courses' : '/login')}
              >
                {isAuthenticated ? 'Go enroll' : 'Login to enroll'}
              </Button>
              {course.videos?.length > 0 && (
                <div style={{ marginTop: 30 }}>
                  <h2 style={{ fontSize: 20, marginBottom: 14 }}>Lessons</h2>
                  <div className="stack gap-sm">
                    {course.videos.map((video) => (
                      <div className="card card-pad" key={video.videoId}>
                        <h3 style={{ fontSize: 16, marginBottom: 5 }}>{video.title}</h3>
                        <p className="muted" style={{ fontSize: 13.5, marginBottom: 12 }}>{video.description || 'Lesson video'}</p>
                        <div style={{ aspectRatio: '16 / 9', background: 'var(--ink-950)' }}>
                          <iframe title={video.title} src={getYoutubeEmbedUrl(video.youtubeURL)} style={{ width: '100%', height: '100%', border: 0 }} allowFullScreen />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
      {isStudent && <CourseAssistant currentCourse={course?.courseName} />}
    </div>
  );
}
