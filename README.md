# Task Tracker

A full-stack task management web app to track what you need to do, what you're working on, and what you've completed.

Built as a hands-on full-stack practice project.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)

---

## Tech Stack

**Frontend**
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Motion](https://motion.dev/)

**Backend**
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)

---

## Project Structure

```
task-tracker/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── themes.js         # Theme definitions
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── server/                   # Express backend
│   ├── src/
│   │   ├── controllers/      # Route logic
│   │   ├── middleware/       # Auth middleware
│   │   ├── routes/           # API routes
│   │   └── lib/              # Prisma client
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
├── .gitignore
├── package.json              # Root — runs both with one command
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js `>= 18.0.0`
- npm `>= 9.0.0`
- PostgreSQL `>= 14`

### Installation

1. Clone the repository

```bash
git clone https://github.com/raulciprian-tudor/Task-Tracker
cd task-tracker
```

2. Install all dependencies

```bash
npm run install:all
```

3. Set up environment variables

Create `server/.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_tracker"
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

4. Set up the database

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### Running the app

```bash
npm run dev
```

This starts both the frontend and backend concurrently:

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3000 |

---

## Features

- **Authentication** — register and login with JWT-based auth, user-scoped tasks
- **Task management** — add, edit, delete tasks with inline editing
- **Status tracking** — mark tasks as To Do, In Progress, or Done
- **Priority levels** — set Low, Medium, or High priority per task
- **Due dates** — assign and update due dates with past-date validation
- **Filtering** — filter tasks by status
- **Sorting** — sort by newest or oldest first
- **5 themes** — Light, Dark, Dusk, Forest, Ocean — persisted via localStorage
- **Responsive** — works on mobile, tablet, and desktop
- **Toast notifications** — success and error feedback on every action
- **Completion tracking** — progress bar showing overall task completion

---

## API Endpoints

### Auth

| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | `/api/auth/register` | Register a user     |
| POST   | `/api/auth/login`    | Login and get token |

### Tasks (all protected — require `Authorization: Bearer <token>`)

| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| GET    | `/api/tasks`              | Get all tasks        |
| POST   | `/api/tasks`              | Create a task        |
| PUT    | `/api/tasks/:id`          | Update a task        |
| DELETE | `/api/tasks/:id`          | Delete a task        |
| PATCH  | `/api/tasks/:id/status`   | Update task status   |
| PATCH  | `/api/tasks/:id/priority` | Update task priority |
| PATCH  | `/api/tasks/:id/due-date` | Update task due date |

---

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
}

model Task {
  id          String    @id @default(uuid())
  description String
  status      String    @default("todo")
  priority    String    @default("medium")
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id])
}
```

---

## License

[MIT](./LICENSE)
