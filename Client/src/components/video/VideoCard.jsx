import { formatDateTime } from '../../utils/formatDate';
import { getYoutubeThumbnail } from '../../utils/youtube';
import { Button } from '../common/Button';
import { EditIcon, TrashIcon, PlayCircleIcon } from '../common/Icons';

export function VideoCard({ video, courseName, onEdit, onDelete }) {
  const thumb = getYoutubeThumbnail(video.youtubeURL);

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--ink-900)' }}>
        {thumb && <img src={thumb} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        <a
          href={video.youtubeURL}
          target="_blank"
          rel="noreferrer"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            background: 'rgba(11,14,20,0.25)',
          }}
          aria-label="Watch on YouTube"
        >
          <PlayCircleIcon size={40} />
        </a>
      </div>
      <div className="stack gap-xs" style={{ padding: '14px 16px' }}>
        {courseName && <span className="eyebrow">{courseName}</span>}
        <h4 style={{ fontSize: 15 }}>{video.title}</h4>
        {video.description && (
          <p className="muted" style={{ fontSize: 12.8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {video.description}
          </p>
        )}
        <span className="muted mono" style={{ fontSize: 11.5 }}>Added {formatDateTime(video.addedAt)}</span>
        <div className="row gap-sm" style={{ marginTop: 6 }}>
          <Button variant="outline" size="sm" icon={EditIcon} onClick={() => onEdit(video)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" icon={TrashIcon} onClick={() => onDelete(video)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
