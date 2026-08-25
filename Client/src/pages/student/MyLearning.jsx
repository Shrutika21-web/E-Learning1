import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState, ErrorState } from '../../components/common/StatePanels';
import * as studentApi from '../../api/studentApi';
import { getYoutubeThumbnail } from '../../utils/youtube';
import { formatDate } from '../../utils/formatDate';
import { ChevronDownIcon, PlayCircleIcon, InboxIcon, VideoIcon } from '../../components/common/Icons';

export default function MyLearning() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const [expanded, setExpanded] = useState(new Set());
  const navigate = useNavigate();

  const load = () => {
    setStatus('loading');
    studentApi
      .getMyCoursesWithVideos()
      .then((data) => {
        setCourses(data);
        setExpanded(new Set(data.map((c) => c.courseId)));
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  const toggle = (courseId) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(courseId) ? next.delete(courseId) : next.add(courseId);
      return next;
    });
  };

  return (
    <div>
      <PageHeader title="My Learning" description="Watch the video lessons for each course you're enrolled in." />

      {status === 'loading' && (
        <div className="stack gap-md">
          {[1, 2].map((i) => <Card key={i}><Skeleton height={90} /></Card>)}
        </div>
      )}

      {status === 'error' && <ErrorState description="Could not load your learning content." onRetry={load} />}

      {status === 'ready' && courses.length === 0 && (
        <EmptyState
          icon={InboxIcon}
          title="Nothing to learn yet"
          description="Enroll in a course to unlock its video lessons here."
          action={<Button variant="gold" onClick={() => navigate('/student/courses')}>Explore Courses</Button>}
        />
      )}

      {status === 'ready' && courses.length > 0 && (
        <div className="stack gap-md">
          {courses.map((course) => {
            const isOpen = expanded.has(course.courseId);
            return (
              <Card key={course.courseId} padded={false}>
                <button
                  onClick={() => toggle(course.courseId)}
                  className="row between"
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '18px 22px', textAlign: 'left' }}
                >
                  <div>
                    <h3 style={{ fontSize: 16 }}>{course.courseName}</h3>
                    <span className="muted mono" style={{ fontSize: 12 }}>
                      Enrolled {formatDate(course.enrolledAt)} · {course.videos.length} video{course.videos.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <ChevronDownIcon size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease', flexShrink: 0 }} />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 14px 14px' }}>
                    {course.videos.length === 0 ? (
                      <div style={{ padding: '20px 8px' }}>
                        <p className="muted" style={{ fontSize: 13.5 }}>No videos are currently available for this course.</p>
                      </div>
                    ) : (
                      <div className="stack gap-xs">
                        {course.videos.map((v) => {
                          const thumb = getYoutubeThumbnail(v.youtubeURL);
                          return (
                            <div
                              key={v.videoId}
                              className="video-list-item"
                              onClick={() => navigate(`/student/learning/${course.courseId}/${v.videoId}`)}
                            >
                              <div className="video-thumb">
                                {thumb ? (
                                  <img src={thumb} alt={v.title} />
                                ) : (
                                  <div className="row center" style={{ width: '100%', height: '100%', color: 'var(--steel-300)' }}>
                                    <VideoIcon size={18} />
                                  </div>
                                )}
                                <span className="play-badge"><PlayCircleIcon size={20} /></span>
                              </div>
                              <div className="stack" style={{ minWidth: 0, justifyContent: 'center' }}>
                                <span style={{ fontWeight: 600, fontSize: 13.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {v.title}
                                </span>
                                {v.description && (
                                  <span className="muted" style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {v.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
