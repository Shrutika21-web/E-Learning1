import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBox } from '../../components/common/SearchBox';
import { SelectField } from '../../components/common/TextField';
import { StudentTable } from '../../components/student/StudentTable';
import { EmptyState, ErrorState } from '../../components/common/StatePanels';
import { useDebounce } from '../../hooks/useDebounce';
import * as adminApi from '../../api/adminApi';
import * as courseApi from '../../api/courseApi';
import { UsersIcon } from '../../components/common/Icons';

export default function EnrolledStudents() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  const load = (courseId) => {
    setStatus('loading');
    Promise.all([adminApi.getEnrolledStudents(courseId || undefined), courses.length ? Promise.resolve(courses) : courseApi.getAllCourses()])
      .then(([s, c]) => {
        setStudents(s);
        setCourses(c);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  // Reload from the server whenever the course filter changes — courseId is
  // the one filter the backend actually supports as a query param.
  useEffect(() => {
    load(courseFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseFilter]);

  const filtered = students.filter((s) => {
    const q = debouncedSearch.toLowerCase();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader title="Enrolled Students" description="Every student enrollment across all courses." />

      <div className="toolbar">
        <SearchBox value={search} onChange={setSearch} placeholder="Search by name or email…" />
        <div style={{ minWidth: 190 }}>
          <SelectField name="courseFilter" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} style={{ marginBottom: 0 }}>
            <option value="">All courses</option>
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
            ))}
          </SelectField>
        </div>
        <div style={{ minWidth: 160 }}>
          <SelectField name="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ marginBottom: 0 }}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </SelectField>
        </div>
      </div>

      {status === 'error' && <ErrorState description="Could not load enrolled students." onRetry={() => load(courseFilter)} />}
      {status === 'ready' && filtered.length === 0 && (
        <EmptyState
          icon={UsersIcon}
          title={search || statusFilter || courseFilter ? 'No students match your filters' : 'No students enrolled yet'}
          description={
            search || statusFilter || courseFilter
              ? 'Try clearing your search or filters.'
              : 'Once students enroll in courses, they will show up here.'
          }
        />
      )}
      {status !== 'error' && (filtered.length > 0 || status === 'loading') && (
        <StudentTable students={filtered} loading={status === 'loading'} />
      )}
    </div>
  );
}
