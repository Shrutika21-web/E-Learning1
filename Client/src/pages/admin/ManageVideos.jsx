import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { SearchBox } from '../../components/common/SearchBox';
import { SelectField } from '../../components/common/TextField';
import { VideoCard } from '../../components/video/VideoCard';
import { VideoFormModal } from '../../components/video/VideoFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState, ErrorState } from '../../components/common/StatePanels';
import { SkeletonGrid } from '../../components/common/Skeleton';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';
import * as videoApi from '../../api/videoApi';
import * as courseApi from '../../api/courseApi';
import { extractErrorMessage, extractFieldErrors } from '../../api/axios';
import { PlusIcon, InboxIcon } from '../../components/common/Icons';

export default function ManageVideos() {
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  const [formOpen, setFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const load = () => {
    setStatus('loading');
    Promise.all([videoApi.getAllVideos(), courseApi.getAllCourses()])
      .then(([v, c]) => {
        setVideos(v);
        setCourses(c);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  const courseNameById = useMemo(() => {
    const map = {};
    for (const c of courses) map[c.courseId] = c.courseName;
    return map;
  }, [courses]);

  const filtered = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCourse = !courseFilter || String(v.courseId) === String(courseFilter);
    return matchesSearch && matchesCourse;
  });

  const openAdd = () => {
    setEditingVideo(null);
    setFormErrors({});
    setFormOpen(true);
  };

  const openEdit = (video) => {
    setEditingVideo(video);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setFormErrors({});
    try {
      if (editingVideo) {
        await videoApi.updateVideo(editingVideo.videoId, payload);
        toast.success('Video updated successfully');
      } else {
        await videoApi.addVideo(payload);
        toast.success('Video created successfully');
      }
      setFormOpen(false);
      load();
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      if (Object.keys(fieldErrors).length) {
        setFormErrors(fieldErrors);
      } else {
        toast.error(extractErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await videoApi.deleteVideo(deleteTarget.videoId);
      toast.success('Video deleted successfully');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Videos"
        description="Attach video lessons to courses."
        actions={
          <Button variant="primary" icon={PlusIcon} onClick={openAdd}>
            Add Video
          </Button>
        }
      />

      <div className="toolbar">
        <SearchBox value={search} onChange={setSearch} placeholder="Search by video title…" />
        <div style={{ minWidth: 200 }}>
          <SelectField
            name="courseFilter"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            style={{ marginBottom: 0 }}
          >
            <option value="">All courses</option>
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseId}>
                {c.courseName}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      {status === 'loading' && <SkeletonGrid count={6} />}
      {status === 'error' && <ErrorState description="Could not load videos." onRetry={load} />}
      {status === 'ready' && filtered.length === 0 && (
        <EmptyState
          icon={InboxIcon}
          title={search || courseFilter ? 'No videos match your filters' : 'No videos yet'}
          description={search || courseFilter ? 'Try clearing your search or filter.' : 'Add your first video lesson to a course.'}
          action={!search && !courseFilter && <Button variant="primary" icon={PlusIcon} onClick={openAdd}>Add Video</Button>}
        />
      )}
      {status === 'ready' && filtered.length > 0 && (
        <div className="course-grid">
          {filtered.map((v) => (
            <VideoCard
              key={v.videoId}
              video={v}
              courseName={courseNameById[v.courseId]}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <VideoFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        video={editingVideo}
        courses={courses}
        serverErrors={formErrors}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this video?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This can't be undone.`}
        confirmLabel="Delete video"
      />
    </div>
  );
}
