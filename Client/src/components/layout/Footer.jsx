export function Footer() {
  return (
    <footer className="footer">
      <div className="container row between wrap gap-md">
        <span>© {new Date().getFullYear()} EduManage. Built for structured, video-based learning.</span>
        <span className="mono" style={{ opacity: 0.7 }}>Learn. Grow. Succeed.</span>
      </div>
    </footer>
  );
}
