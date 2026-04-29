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

---

## Project Structure

```
task-tracker/
├── client/             # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/             # Express backend
│   ├── src/
│   └── package.json
├── .gitignore
├── package.json        # Root — runs both with one command
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js `>= 18.0.0`
- npm `>= 9.0.0`

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/task-tracker.git
cd task-tracker
```

2. Install all dependencies (root, client, and server)

```bash
npm run install:all
```

### Running the app

```bash
npm run dev
```

This starts both the frontend and backend concurrently:

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| Backend  | http://localhost:3000  |

---

## Features

- Add, update, and delete tasks
- Mark tasks as **To Do**, **In Progress**, or **Done**
- Filter tasks by status
- Persistent storage via the backend API
- Smooth animations and transitions

---

## API Endpoints

| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| GET    | `/api/tasks`     | Get all tasks       |
| POST   | `/api/tasks`     | Create a new task   |
| PUT    | `/api/tasks/:id` | Update a task       |
| DELETE | `/api/tasks/:id` | Delete a task       |

---

## Task Schema

```json
{
  "id": "string",
  "description": "string",
  "status": "todo | in-progress | done",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

---

## License

[MIT](./LICENSE)
