# EduManage — Client

React + Vite frontend for the Course Management System backend. Built against
the **actual backend source** (not just the API doc), so a few real behaviors
are worth knowing about.

## Setup

```bash
npm install
cp .env.example .env   # edit VITE_API_URL if your backend isn't on :5000
npm run dev
```

Backend must be running separately (Node/Express/MySQL, JWT auth). Default
expected base URL: `http://localhost:5000`.

Demo credentials (seeded by the backend):

- Admin: `admin@mern.com` / `admin123`
- Student: `student1@gmail.com` / `stud123` (also `student2@gmail.com`, `student3@gmail.com`, same password)

## Real backend contract vs. the original spec doc

While auditing `Server/` directly, a few discrepancies turned up between the
generic frontend-generation prompt and what the code actually does. The
client is built against the code, not the doc:

- **`POST /student/register-to-course`** — the validator requires `name` and
  `mobileNo` in the body (10-digit, exact) in addition to `courseId`, even
  though the service only ever uses the JWT's `userId` for identity. The
  enroll modal collects both fields for this reason.
- **`PUT /student/change-password`** — requires `confirmPassword` matching
  `newPassword`, not just `newPassword` alone.
- **`fees`** must be a whole integer (`isInt`), not a decimal.
- **Response shapes are inconsistent across endpoints.** Most success
  responses are wrapped as `{ success, message, data: {...} }`. Two
  exceptions: `POST /auth/login` returns `{ success, message, token, user }`
  directly, and `GET /student/my-course-with-videos` returns
  `{ success, courses }` with no `data` wrapper. The API layer
  (`src/api/*.js`) unwraps each endpoint correctly rather than assuming one
  shape everywhere.
- **Validation errors** come back as `{ success: false, message, errors: [{ field, message }] }`.
  `extractFieldErrors()` in `src/api/axios.js` turns this into inline form
  errors; `extractErrorMessage()` pulls a clean toast message for everything
  else (already-enrolled, course inactive, student profile not found, etc).
- **Enrolled-student filtering** — the backend only supports filtering by
  `courseId` as a query param. Search-by-name and status filters on the
  admin "Enrolled Students" page are applied client-side against the
  already-fetched list.
- **Video expiry** is enforced entirely server-side. The frontend never
  computes expiry — it only ever renders whatever
  `GET /student/my-course-with-videos` returns for a given course.

## Structure

```
src/
├── api/            Axios instance + one service module per backend resource
├── components/
│   ├── common/     Buttons, fields, modals, toasts, states, icons
│   ├── layout/     Navbar, Sidebar, DashboardLayout, route guards
│   ├── course/     Course card/table/form (shared by public + admin)
│   ├── video/      Video card/form (admin)
│   └── student/    Enroll modal, enrolled-students table (admin)
├── context/        AuthContext, ToastContext
├── hooks/          useAuth, useToast, useDebounce
├── pages/
│   ├── admin/      Dashboard, ManageCourses, ManageVideos, EnrolledStudents
│   └── student/    Dashboard, AvailableCourses, MyCourses, MyLearning,
│                    VideoLearning, ChangePassword
└── utils/          formatDate, currency, youtube (id/thumbnail/embed +
                     regex mirroring the backend's URL validator), validators
                     (mirror every backend validation rule exactly)
```

## Notes

- JWT is stored in `localStorage` under `token` / `user`; never the password.
- A 401 anywhere clears the session and redirects to `/login` automatically
  (`src/api/axios.js` response interceptor).
- Route guards (`AdminRoute` / `StudentRoute` / `GuestRoute`) cross-redirect
  the wrong role to their own dashboard rather than showing a blank page.
- Client-side validators exist purely for fast feedback; the backend is the
  source of truth, and server validation errors are shown inline regardless.
