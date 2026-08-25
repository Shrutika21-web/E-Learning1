import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CourseCard } from '../components/course/CourseCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import { EmptyState, ErrorState } from '../components/common/StatePanels';
import { SearchBox } from '../components/common/SearchBox';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import * as courseApi from '../api/courseApi';
import { InboxIcon } from '../components/common/Icons';
import { CourseAssistant } from '../components/student/CourseAssistant';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const { isAuthenticated, isStudent } = useAuth();
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

  const filtered = courses.filter((c) => c.courseName.toLowerCase().includes(debouncedSearch.toLowerCase()));

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <div className="section-head">
          <span className="eyebrow">Catalog</span>
          <h2 style={{ marginTop: 8 }}>Available courses</h2>
          <p style={{ marginTop: 8 }}>Every course currently open for enrollment.</p>
        </div>

        <div className="toolbar">
          <SearchBox value={search} onChange={setSearch} placeholder="Search courses…" />
        </div>

        {status === 'loading' && <SkeletonGrid count={6} />}
        {status === 'error' && <ErrorState description="Could not load courses right now." onRetry={load} />}
        {status === 'ready' && filtered.length === 0 && (
          <EmptyState
            icon={InboxIcon}
            title={search ? 'No courses match your search' : 'No active courses'}
            description={search ? 'Try a different search term.' : 'Check back soon for newly opened courses.'}
          />
        )}
        {status === 'ready' && filtered.length > 0 && (
          <div className="course-grid">
            {filtered.map((c) => (
              <CourseCard
                key={c.courseId}
                course={c}
                footer={
                  <>
                    <Button variant="outline" block onClick={() => navigate(`/courses/${c.courseId}`)}>
                      View Details
                    </Button>
                    <Button variant="gold" block onClick={() => navigate(isAuthenticated ? '/student/courses' : '/login')}>
                      Enroll
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
      {isStudent && <CourseAssistant />}
    </div>
  );
}
