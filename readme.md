# Project Manager

A full-stack project & task management app built as a MERN monorepo — role-based projects, task/subtask tracking with file attachments, and a complete JWT auth system with email verification.

## Stack

**Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT (access + refresh tokens), Multer, Nodemailer + Mailgen, express-validator
**Frontend:** React 19, Zustand, React Router, Tailwind CSS, Vite, Axios

## Features

- **Authentication** — Register/login with email verification, JWT access & refresh token rotation, forgot/reset password flow, change password, resend verification email.
- **Projects** — Create, update, delete projects; role-based membership (`admin`, `project_admin`, `member`) with permission-gated routes for adding/removing members and updating roles.
- **Tasks & Subtasks** — Full CRUD on tasks scoped to a project, subtasks under each task, file attachments on task creation (up to 5 files via Multer), task status tracking (`todo`, `in_progress`, `done`).
- **Frontend** — Protected routes, per-feature Zustand stores (auth, projects, tasks, members, theme), dashboard, project board, and member management views.

## Project Structure

```
project_manager/
├── backend/
│   └── src/
│       ├── controllers/   # auth, project, task, healthcheck
│       ├── models/        # user, project, projectMember, task, subtask, note
│       ├── routes/        # auth, project, task, healthcheck
│       ├── middlewares/    # JWT auth, project-permission guard, validation, multer
│       ├── validators/     # request validation schemas
│       └── utils/          # ApiError, ApiResponse, asyncHandler, mail
└── frontend/
    └── src/
        ├── pages/          # Login, Register, DashBoard, ProjectBoard, ProjectMembers
        ├── components/     # modals, TaskCard, ProtectedRoute, ThemeToggle
        ├── store/          # Zustand stores (auth, project, task, member, theme)
        └── api/            # Axios instance
```

## Getting Started

### Backend
```bash
cd backend
npm install
# add a .env with MongoDB URI, JWT secrets, SMTP credentials, etc.
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Overview

| Resource | Routes |
|---|---|
| Auth | `POST /register`, `/login`, `/logout`, `/refresh-token`, `/forgot-password`, `/reset-password/:token`, `/verify-email/:token`, `/change-password`, `/current-user` |
| Projects | `GET/POST /projects`, `GET/PUT/DELETE /projects/:id`, member add/update/remove under `/projects/:id/members` |
| Tasks | `GET/POST /tasks/:projectId`, `GET/PUT/DELETE /tasks/:projectId/t/:taskId`, subtasks under `/tasks/:projectId/t/:taskId/subtasks` |

Access to project and task routes is gated by project role (`admin` / `project_admin` / `member`) via a custom `validateProjectPermission` middleware.

## Notes

This project was built to gain a genuine, from-scratch understanding of a production-style Express/MongoDB backend (custom error handling, async middleware wrapping, JWT rotation) rather than following a tutorial's code verbatim.