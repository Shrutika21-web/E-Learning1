import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/StatePanels';
import * as studentApi from '../../api/studentApi';
import { getYoutubeEmbedUrl, getYoutubeThumbnail } from '../../utils/youtube';
import { formatDate } from '../../utils/formatDate';
import { ChevronRightIcon, PlayCircleIcon, VideoIcon } from '../../components/common/Icons';

export default function VideoLearning() {
  const { courseId, videoId } = useParams();
  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  const load = () => {
    setStatus('loading');
    studentApi
      .getMyCoursesWithVideos()
      .then((courses) => {
        const found = courses.find((c) => String(c.courseId) === String(courseId));
        if (found) {
          setCourse(found);
          setStatus('ready');
        } else {
          setStatus('not-found');
        }
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, [courseId]);

  if (status === 'loading') {
    return (
      <div className="learn-layout">
        <Skeleton height="auto" style={{ aspectRatio: '16/9' }} radius={14} />
        <Card><Skeleton height={200} /></Card>
      </div>
    );
  }

  if (status === 'error') return <ErrorState description="Could not load this lesson." onRetry={load} />;

  if (status === 'not-found' || !course) {
    return (
      <ErrorState
        title="Course not found"
        description="You may not be enrolled in this course, or the enrollment record couldn't be found."
      />
    );
  }

  const video = course.videos.find((v) => String(v.videoId) === String(videoId));

  if (!video) {
    return (
      <ErrorState
        title="This video isn't available"
        description="It may have been removed, or is no longer within your video access window."
      />
    );
  }

  const embedUrl = getYoutubeEmbedUrl(video.youtubeURL);

  return (
    <div>
      <div className="row gap-xs muted" style={{ fontSize: 13, marginBottom: 16 }}>
        <Link to="/student/learning" className="muted">My Learning</Link>
        <ChevronRightIcon size={13} />
        <span style={{ color: 'var(--ink-900)', fontWeight: 500 }}>{course.courseName}</span>
      </div>

      <div className="learn-layout">
        <div>
          <div className="player-wrap">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="row center" style={{ width: '100%', height: '100%', color: 'var(--steel-500)' }}>
                Unable to load this video.
              </div>
            )}
          </div>
          <Card style={{ marginTop: 18 }}>
            <span className="eyebrow">{course.courseName}</span>
            <h2 style={{ fontSize: 20, marginTop: 8, marginBottom: 10 }}>{video.title}</h2>
            {video.description && <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>{video.description}</p>}
          </Card>
        </div>

        <Card padded={false}>
          <div style={{ padding: '18px 18px 8px' }}>
            <h3 style={{ fontSize: 15 }}>Course videos</h3>
            <span className="muted mono" style={{ fontSize: 12 }}>{course.videos.length} lesson{course.videos.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="stack gap-xs" style={{ padding: '0 10px 10px' }}>
            {course.videos.map((v) => {
              const thumb = getYoutubeThumbnail(v.youtubeURL);
              const isActive = String(v.videoId) === String(videoId);
              return (
                <div
                  key={v.videoId}
                  className={`video-list-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(`/student/learning/${course.courseId}/${v.videoId}`)}
                >
                  <div className="video-thumb">
                    {thumb ? (
                      <img src={thumb} alt={v.title} />
                    ) : (
                      <div className="row center" style={{ width: '100%', height: '100%', color: 'var(--steel-300)' }}>
                        <VideoIcon size={16} />
                      </div>
                    )}
                    {isActive && <span className="play-badge"><PlayCircleIcon size={18} /></span>}
                  </div>
                  <div className="stack" style={{ minWidth: 0, justifyContent: 'center' }}>
                    <span style={{ fontWeight: isActive ? 700 : 600, fontSize: 13.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {v.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
