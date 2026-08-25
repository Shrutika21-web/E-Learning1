import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { CourseCard } from '../../components/course/CourseCard';
import { SearchBox } from '../../components/common/SearchBox';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SkeletonGrid } from '../../components/common/Skeleton';
import { EmptyState, ErrorState } from '../../components/common/StatePanels';
import { EnrollModal } from '../../components/student/EnrollModal';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';
import * as courseApi from '../../api/courseApi';
import * as studentApi from '../../api/studentApi';
import { extractErrorMessage, extractFieldErrors } from '../../api/axios';
import { InboxIcon, CheckIcon } from '../../components/common/Icons';

export default function AvailableCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  const [enrollTarget, setEnrollTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const toast = useToast();

  const load = () => {
    setStatus('loading');
    Promise.all([courseApi.getAllActiveCourses(), studentApi.getMyCourses()])
      .then(([active, mine]) => {
        setCourses(active);
        setEnrolledIds(new Set(mine.map((c) => c.courseId)));
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  const filtered = courses.filter((c) => c.courseName.toLowerCase().includes(debouncedSearch.toLowerCase()));

  const handleEnroll = async ({ name, mobileNo }) => {
    setSubmitting(true);
    setFormErrors({});
    try {
      await studentApi.registerToCourse({ courseId: enrollTarget.courseId, name, mobileNo });
      toast.success(`Enrolled in ${enrollTarget.courseName}`);
      setEnrollTarget(null);
      load();
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      if (Object.keys(fieldErrors).length) {
        setFormErrors(fieldErrors);
      } else {
        // Surfaces backend messages like "already enrolled", "course inactive",
        // or "student profile not found" directly rather than a generic error.
        toast.error(extractErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Available Courses" description="Browse and enroll in courses currently open for registration." />

      <div className="toolbar">
        <SearchBox value={search} onChange={setSearch} placeholder="Search courses…" />
      </div>

      {status === 'loading' && <SkeletonGrid count={6} />}
      {status === 'error' && <ErrorState description="Could not load available courses." onRetry={load} />}
      {status === 'ready' && filtered.length === 0 && (
        <EmptyState
          icon={InboxIcon}
          title={search ? 'No courses match your search' : 'No courses currently open'}
          description={search ? 'Try a different search term.' : 'Check back soon for newly opened courses.'}
        />
      )}
      {status === 'ready' && filtered.length > 0 && (
        <div className="course-grid">
          {filtered.map((c) => {
            const isEnrolled = enrolledIds.has(c.courseId);
            return (
              <CourseCard
                key={c.courseId}
                course={c}
                footer={
                  <>
                    <Link className="btn btn-outline" to={`/courses/${c.courseId}`}>View details</Link>
                    {isEnrolled ? (
                      <Badge tone="teal" dot className="btn-block" style={{ justifyContent: 'center', padding: '10px 0', width: '100%' }}><CheckIcon size={13} /> Already enrolled</Badge>
                    ) : (
                      <Button variant="gold" block onClick={() => { setFormErrors({}); setEnrollTarget(c); }}>Enroll Now</Button>
                    )}
                  </>
                }
              />
            );
          })}
        </div>
      )}

      <EnrollModal
        open={!!enrollTarget}
        onClose={() => setEnrollTarget(null)}
        onSubmit={handleEnroll}
        submitting={submitting}
        course={enrollTarget}
        serverErrors={formErrors}
      />
    </div>
  );
}
