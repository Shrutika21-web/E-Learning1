import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { SearchBox } from '../../components/common/SearchBox';
import { CourseTable } from '../../components/course/CourseTable';
import { CourseFormModal } from '../../components/course/CourseFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState, ErrorState } from '../../components/common/StatePanels';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';
import * as courseApi from '../../api/courseApi';
import { extractErrorMessage, extractFieldErrors } from '../../api/axios';
import { PlusIcon, InboxIcon } from '../../components/common/Icons';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const load = () => {
    setStatus('loading');
    courseApi
      .getAllCourses()
      .then((data) => {
        setCourses(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  const filtered = courses.filter((c) => c.courseName.toLowerCase().includes(debouncedSearch.toLowerCase()));

  const openAdd = () => {
    setEditingCourse(null);
    setFormErrors({});
    setFormOpen(true);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setFormErrors({});
    try {
      if (editingCourse) {
        await courseApi.updateCourse(editingCourse.courseId, payload);
        toast.success('Course updated successfully');
      } else {
        await courseApi.addCourse(payload);
        toast.success('Course created successfully');
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
      await courseApi.deleteCourse(deleteTarget.courseId);
      toast.success('Course deleted successfully');
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
        title="Courses"
        description="Create and manage every course in the catalog."
        actions={
          <Button variant="primary" icon={PlusIcon} onClick={openAdd}>
            Add Course
          </Button>
        }
      />

      <div className="toolbar">
        <SearchBox value={search} onChange={setSearch} placeholder="Search by course name…" />
      </div>

      {status === 'error' && <ErrorState description="Could not load courses." onRetry={load} />}
      {status !== 'error' && filtered.length === 0 && status === 'ready' && (
        <EmptyState
          icon={InboxIcon}
          title={search ? 'No courses match your search' : 'No courses yet'}
          description={search ? 'Try a different search term.' : 'Create your first course to get started.'}
          action={!search && <Button variant="primary" icon={PlusIcon} onClick={openAdd}>Add Course</Button>}
        />
      )}
      {status !== 'error' && (filtered.length > 0 || status === 'loading') && (
        <CourseTable courses={filtered} loading={status === 'loading'} onEdit={openEdit} onDelete={setDeleteTarget} />
      )}

      <CourseFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        course={editingCourse}
        serverErrors={formErrors}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this course?"
        description={`Are you sure you want to delete "${deleteTarget?.courseName}"? Associated enrollments and videos will also be removed.`}
        confirmLabel="Delete course"
      />
    </div>
  );
}
