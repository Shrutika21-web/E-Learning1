-- ============================================================
-- MERN Course Management System - Seed Data
-- Run schema.sql FIRST, then this file.
--
-- Passwords are stored as real bcrypt hashes (salt rounds = 10),
-- verified to be compatible with bcryptjs.compare().
--
-- Plain-text login credentials for testing:
--   admin@mern.com     / admin123   (role: admin)
--   student1@gmail.com / stud123    (role: student)
--   student2@gmail.com / stud123    (role: student)
--   student3@gmail.com / stud123    (role: student)
--
-- If you'd rather generate fresh hashes yourself, run:
--   npm run seed:hashes
-- (after `npm install`) to print new INSERT statements.
-- ============================================================

USE mern_db;

-- ----- Users -----
INSERT INTO users (email, password, role) VALUES
('admin@mern.com',     '$2b$10$mZxQNz.PW7RJB3ZwAlNCuuLDqHJFUTNq1Tx0bQBEuyblMSkc2eagu', 'admin'),
('student1@gmail.com', '$2b$10$3MbVvqhuAbwTGAhv0VXUG.FQWJQx18w3HAmGavq4TS/P6aIXeljiO', 'student'),
('student2@gmail.com', '$2b$10$XU/bMtaK/JXgfPiptUZw/.Y1wRxVTG5aEhoZV/47bEzM3kWT8XdJW', 'student'),
('student3@gmail.com', '$2b$10$udXgDueVY5NlT5rYDJzI5.NEl4M.RwufLFG8g5s.XEIvuvQRigNwW', 'student');

-- ----- Students -----
-- user_id values below assume a fresh database (auto-increment starting at 1):
--   1 = admin, 2 = student1, 3 = student2, 4 = student3
INSERT INTO students (user_id, name, mobile_no) VALUES
(2, 'Rahul Sharma', '9876543210'),
(3, 'Priya Verma',  '9123456780'),
(4, 'Amit Singh',   '9988776655');

-- ----- Courses -----
-- Dates are set relative to a wide window so at least one course is
-- "active" (start_date <= CURDATE() <= end_date) regardless of when
-- you run this seed file. Adjust as needed for your testing.
INSERT INTO courses (course_name, description, fees, start_date, end_date, video_expire_days) VALUES
('MERN Stack Development', 'Full Stack Web Development with MongoDB alternative: MySQL, Express, React, Node.js', 25000, '2025-01-01', '2027-12-31', 180),
('Python for Data Science', 'Python programming, Pandas, NumPy, and data visualization', 18000, '2025-01-01', '2027-12-31', 90),
('Java Backend Development', 'Core Java, Spring Boot, and REST API development', 22000, '2020-01-01', '2020-12-31', 180);

-- ----- Enrollments -----
-- reg_no 1 = Rahul Sharma, 2 = Priya Verma, 3 = Amit Singh (matches insert order above)
INSERT INTO enrollments (reg_no, course_id, status) VALUES
(1, 1, 'active'),
(2, 1, 'active'),
(1, 2, 'active'),
(3, 2, 'completed');

-- ----- Videos -----
INSERT INTO videos (course_id, title, description, youtube_url) VALUES
(1, 'Introduction to MERN Stack', 'Overview of MongoDB, Express, React, and Node.js', 'https://www.youtube.com/watch?v=7CqJlxBYj-M'),
(1, 'Building REST APIs with Express', 'Hands-on guide to building REST APIs', 'https://www.youtube.com/watch?v=pKd0Rpw7O48'),
(2, 'Getting Started with Pandas', 'Data manipulation basics using Pandas', 'https://www.youtube.com/watch?v=vmEHCJofslg');
