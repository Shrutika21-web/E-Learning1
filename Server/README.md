# MERN Course Management System — Backend

Production-quality REST API backend built with **Node.js, Express.js, and MySQL** (no MongoDB/Mongoose), using JWT authentication and role-based authorization (admin / student).

## Technologies

- Node.js + Express.js
- MySQL (via `mysql2/promise`, parameterized queries, connection pool)
- JWT authentication (`jsonwebtoken`)
- `bcryptjs` for password hashing
- `express-validator` for request validation
- `cors`, `dotenv`

---

## 1. Installation

```bash
cd backend
npm install
```

## 2. Environment Setup

Copy the example env file and fill in your own values:

```bash
cp .env.example .env
```

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mern_db
DB_PORT=3306
DB_CONNECTION_LIMIT=10

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d

BCRYPT_SALT_ROUNDS=10

CORS_ORIGIN=http://localhost:3000
```

`.env` is git-ignored — never commit real secrets.

## 3. Database Setup

1. Open MySQL:
   ```bash
   mysql -u root -p
   ```
2. Run the schema (creates `mern_db` and all tables):
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Run the seed data (creates an admin + 3 students, sample courses, enrollments, and videos with **real bcrypt password hashes**):
   ```bash
   mysql -u root -p < database/seed.sql
   ```

   Seed login credentials:

   | Email | Password | Role |
   |---|---|---|
   | admin@mern.com | admin123 | admin |
   | student1@gmail.com | stud123 | student |
   | student2@gmail.com | stud123 | student |
   | student3@gmail.com | stud123 | student |

   If you'd rather generate fresh hashes yourself (e.g. different passwords), run `npm run seed:hashes` after `npm install` — it prints ready-to-run `INSERT` statements with newly generated bcrypt hashes.

## 4. Run the Backend

Development (auto-restart with nodemon):
```bash
npm run dev
```

Production:
```bash
npm start
```

Server runs at:
```
http://localhost:5000
```
(or whatever `PORT` you set in `.env`)

---

## 5. Project Structure

```
backend/
├── config/
│   └── db.js                 # MySQL connection pool
├── controllers/               # Request handlers
│   ├── authController.js
│   ├── courseController.js
│   ├── videoController.js
│   ├── adminController.js
│   └── studentController.js
├── middleware/
│   ├── authMiddleware.js      # JWT verification -> req.user
│   ├── roleMiddleware.js      # authorize('admin' | 'student')
│   └── errorMiddleware.js     # 404 + centralized error handler
├── routes/
│   ├── authRoutes.js
│   ├── courseRoutes.js
│   ├── videoRoutes.js
│   ├── adminRoutes.js
│   └── studentRoutes.js
├── services/                  # DB access / business logic
│   ├── authService.js
│   ├── courseService.js
│   ├── videoService.js
│   └── studentService.js
├── utils/
│   ├── jwt.js
│   └── response.js
├── validators/                 # express-validator rule sets
│   ├── authValidator.js
│   ├── courseValidator.js
│   ├── videoValidator.js
│   └── studentValidator.js
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── generateSeedHashes.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

## 6. API Endpoint Table

| # | Method | Path | Auth | Role |
|---|---|---|---|---|
| 1 | POST | `/auth/login` | No | — |
| 2 | GET | `/course/all-active-courses` | No | — |
| 3 | GET | `/course/all-courses` | Yes | admin |
| 4 | POST | `/course/add` | Yes | admin |
| 5 | PUT | `/course/update/:courseId` | Yes | admin |
| 6 | DELETE | `/course/delete/:courseId` | Yes | admin |
| 7 | GET | `/video/all-videos` | Yes | admin |
| 8 | POST | `/video/add` | Yes | admin |
| 9 | PUT | `/video/update/:videoId` | Yes | admin |
| 10 | DELETE | `/video/delete/:videoId` | Yes | admin |
| 11 | GET | `/admin/enrolled-students` | Yes | admin |
| 12 | POST | `/student/register-to-course` | Yes | student |
| 13 | PUT | `/student/change-password` | Yes | student |
| 14 | GET | `/student/my-courses` | Yes | student |
| 15 | GET | `/student/my-course-with-videos` | Yes | student |

For every protected route, send:
```
Authorization: Bearer <JWT_TOKEN>
```

### Response format

Success:
```json
{ "success": true, "message": "Operation successful", "data": { } }
```

Error:
```json
{ "success": false, "message": "Something went wrong" }
```

(`POST /auth/login` and `GET /student/my-course-with-videos` return their payload at the top level — `token`/`user` and `courses` respectively — to match the exact response shapes specified in the project brief.)

---

## 7. Detailed Endpoint Documentation

### AI Course Assistant configuration
The student assistant uses active course data from MySQL and calls Mistral through the server. Keep these values in `Server/.env`; never put the API key in the React app:

```env
MISTRAL_API_KEY=your-mistral-api-key
MISTRAL_MODEL=mistral-small-latest
# Optional Mistral-compatible endpoint override
# MISTRAL_API_URL=https://api.mistral.ai/v1/chat/completions
```

`POST /api/ai/chat` requires a student JWT and accepts `{ "question": "...", "currentCourse": "..." }`. Without `MISTRAL_API_KEY`, the endpoint uses a limited catalog-grounded fallback and does not invent course details.

### `POST /auth/login`
- Auth: none
- Body: `{ "email": "student1@gmail.com", "password": "stud123" }`
- 200: `{ success, message, token, user: { userId, email, role } }`
- 401: invalid credentials
- 400: validation error (missing/malformed email or password)

### `GET /course/all-active-courses`
- Auth: none
- Returns courses where `CURDATE()` is between `start_date` and `end_date`.

### `GET /course/all-courses` (admin)
- Query: `startDate`, `endDate` (optional, `YYYY-MM-DD`)
- Returns all courses, optionally filtered.

### `POST /course/add` (admin)
- Body: `courseName, description, fees, startDate, endDate, videoExpireDays`
- 201 on success, 400 on validation error (e.g. `endDate < startDate`, negative fees).

### `PUT /course/update/:courseId` (admin)
- Same body as add. 404 if the course doesn't exist.

### `DELETE /course/delete/:courseId` (admin)
- 404 if not found. Cascades to `enrollments` and `videos` via FK `ON DELETE CASCADE`.

### `GET /video/all-videos` (admin)
- Query: `courseId` (optional). Returns all videos, or only those for a course.

### `POST /video/add` (admin)
- Body: `courseId, title, youtubeURL, description`
- 404 if `courseId` doesn't reference an existing course.

### `PUT /video/update/:videoId` (admin)
- Body: `courseId, title, youtubeURL, description`
- 404 if video or course not found.

### `DELETE /video/delete/:videoId` (admin)
- 404 if video not found.

### `GET /admin/enrolled-students` (admin)
- Query: `courseId` (optional)
- Returns joined `students + users + enrollments + courses` data:
  `regNo, name, email, mobileNo, courseId, courseName, enrolledAt, status`.

### `POST /student/register-to-course` (student)
- Body: `{ "courseId": 1, "name": "...", "mobileNo": "..." }`
- Identity comes from the JWT (`req.user.userId`), **not** from any `email` in the body.
- Validates: course exists, course is currently active, student not already enrolled (checked in-app **and** enforced by the `UNIQUE(reg_no, course_id)` DB constraint).
- 409 if already enrolled.

### `PUT /student/change-password` (student)
- Body: `{ "newPassword": "...", "confirmPassword": "..." }`
- Hashes with bcrypt before storing; never stores plain text.

### `GET /student/my-courses` (student)
- Returns all courses the logged-in student is enrolled in (via JWT `user_id` → `students` → `enrollments` → `courses`).

### `GET /student/my-course-with-videos` (student)
- Returns enrolled courses with only the videos still inside their validity window:
  `NOW() <= enrolled_at + INTERVAL video_expire_days DAY`.
- A student can never see videos for courses they aren't enrolled in.

---

## 8. Postman Testing Guide

Set a Postman environment variable `baseUrl = http://localhost:5000` and variables `adminToken` / `studentToken` to store JWTs from login responses.

1. **Login admin** — `POST {{baseUrl}}/auth/login` — body `{"email":"admin@mern.com","password":"admin123"}` → copy `token` into `adminToken`.
2. **Login student** — `POST {{baseUrl}}/auth/login` — body `{"email":"student1@gmail.com","password":"stud123"}` → copy `token` into `studentToken`.
3. **Get active courses** — `GET {{baseUrl}}/course/all-active-courses` (no auth).
4. **Admin: get all courses** — `GET {{baseUrl}}/course/all-courses` — header `Authorization: Bearer {{adminToken}}`.
5. **Admin: add course** — `POST {{baseUrl}}/course/add` — admin token — body per spec.
6. **Admin: update course** — `PUT {{baseUrl}}/course/update/1` — admin token.
7. **Admin: delete course** — `DELETE {{baseUrl}}/course/delete/1` — admin token.
8. **Admin: get videos** — `GET {{baseUrl}}/video/all-videos?courseId=1` — admin token.
9. **Admin: add video** — `POST {{baseUrl}}/video/add` — admin token.
10. **Admin: update video** — `PUT {{baseUrl}}/video/update/1` — admin token.
11. **Admin: delete video** — `DELETE {{baseUrl}}/video/delete/1` — admin token.
12. **Admin: get enrolled students** — `GET {{baseUrl}}/admin/enrolled-students?courseId=1` — admin token.
13. **Student: register course** — `POST {{baseUrl}}/student/register-to-course` — student token — body `{"courseId":1,"name":"Rahul Sharma","mobileNo":"9876543210"}`.
14. **Student: change password** — `PUT {{baseUrl}}/student/change-password` — student token — body `{"newPassword":"newPass123","confirmPassword":"newPass123"}`.
15. **Student: get my courses** — `GET {{baseUrl}}/student/my-courses` — student token.
16. **Student: get courses with valid videos** — `GET {{baseUrl}}/student/my-course-with-videos` — student token.

---

## 9. Error Cases Covered

| Case | Result |
|---|---|
| Wrong email / password | 401 |
| Missing email / password | 400 (validation) |
| Invalid JWT | 401 |
| Expired JWT | 401 (`Access token has expired`) |
| Student calling admin endpoint | 403 |
| Admin calling student endpoint | 403 |
| Non-existing course | 404 |
| Non-existing video | 404 |
| Duplicate enrollment | 409 |
| Invalid course/video ID (non-numeric) | 400 |
| Invalid mobile number (≠10 digits) | 400 |
| Invalid dates / `endDate < startDate` | 400 |
| Negative fees | 400 |
| Invalid YouTube URL | 400 |
| Database connection failure | 500 (generic message; details logged server-side only) |

---

## 10. How JWT Authentication Works

1. On login, the server verifies the email/password (bcrypt compare) and signs a JWT containing only `{ userId, email, role }` — never the password or other sensitive data.
2. The client sends this token on every subsequent request as `Authorization: Bearer <token>`.
3. `middleware/authMiddleware.js` verifies the signature and expiry using `JWT_SECRET`, then attaches the decoded payload to `req.user`.
4. Downstream controllers use `req.user.userId` / `req.user.role` — never trusting client-supplied identity fields in the request body.

## 11. Admin / Student Authorization

`middleware/roleMiddleware.js` exports `authorize(...roles)`, used **after** `authenticate`:

```js
router.post('/course/add', authenticate, authorize('admin'), courseController.addCourse);
```

If `req.user.role` isn't in the allowed list, the request is rejected with `403 Forbidden` before it reaches the controller.

## 12. How Video Expiry Works

Each enrollment records `enrolled_at` (timestamp of registration). Each course has `video_expire_days`. A video is considered valid for a given student while:

```
NOW() <= enrolled_at + INTERVAL video_expire_days DAY
```

This is computed directly in SQL (`DATE_ADD(e.enrolled_at, INTERVAL c.video_expire_days DAY)`) inside `studentService.getMyCoursesWithVideos`, so expired videos are filtered out server-side and never sent to the client — and a student can only see videos for courses they're actually enrolled in, since the query is scoped through `enrollments`.

---

## 13. Common Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `Failed to connect to the database. Server not started.` | MySQL not running, or wrong `.env` credentials | Confirm MySQL is running and `DB_HOST/DB_USER/DB_PASSWORD/DB_NAME` are correct |
| `ER_ACCESS_DENIED_ERROR` | Wrong MySQL username/password | Check `.env` |
| `ER_BAD_DB_ERROR` | `mern_db` doesn't exist yet | Run `schema.sql` first |
| `ER_DUP_ENTRY` on register-to-course | Student already enrolled | Expected — returns 409 |
| `401 Invalid access token` | Token malformed, wrong `JWT_SECRET`, or missing `Bearer` prefix | Re-login and copy the fresh token exactly |
| `403 Access denied` | Using a student token on an admin route (or vice versa) | Use the correct role's token |
| Videos not showing for a student | Video expired (`enrolled_at + video_expire_days` has passed) or student not enrolled in that course | Check `enrollments.enrolled_at` and `courses.video_expire_days` |
