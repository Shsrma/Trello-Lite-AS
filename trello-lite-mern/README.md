# Trello Lite - Project Management System

Full-stack MERN application with real-time features using Socket.IO.

## Features

- **Authentication**: JWT-based auth with access and refresh tokens
- **Projects**: Create, update, delete projects with role-based access
- **Tasks**: Drag-and-drop Kanban board (TODO, IN_PROGRESS, DONE)
- **Real-time**: Socket.IO for live updates
- **Notifications**: In-app and email notifications
- **Role-Based Access Control**: ADMIN and MEMBER roles

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO
- Nodemailer
- Zod Validation

### Frontend
- React + TypeScript
- Vite
- React Router
- Axios
- Socket.IO Client
- Tailwind CSS

### Infrastructure
- Docker + Docker Compose
- Nginx
- MongoDB Container

## Quick Start

### Using Docker (Recommended)

```bash
cd trello-lite-mern
docker-compose -f docker/docker-compose.yml up --build
```

Access:
- Frontend: http://localhost
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Manual Setup

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/trello-lite
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_SALT_ROUNDS=10
ALLOWED_ORIGINS=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh` - Refresh token
- POST `/api/auth/logout` - Logout
- GET `/api/auth/profile` - Get profile

### Projects
- GET `/api/projects` - Get all projects
- POST `/api/projects` - Create project
- GET `/api/projects/:id` - Get project
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project
- POST `/api/projects/:id/members` - Add member
- DELETE `/api/projects/:id/members/:userId` - Remove member

### Tasks
- GET `/api/tasks/project/:projectId` - Get tasks
- POST `/api/tasks` - Create task
- GET `/api/tasks/:id` - Get task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task
- POST `/api/tasks/reorder` - Reorder tasks

### Notifications
- GET `/api/notifications` - Get notifications
- PATCH `/api/notifications/:id/read` - Mark as read
- PATCH `/api/notifications/read-all` - Mark all as read
- DELETE `/api/notifications/:id` - Delete notification

## Socket Events

### Client → Server
- `join:project` - Join project room
- `leave:project` - Leave project room

### Server → Client
- `notification:new` - New notification
- `task:created` - Task created
- `task:updated` - Task updated
- `tasks:reordered` - Tasks reordered

## Project Structure

```
trello-lite-mern/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── docker/
    ├── Dockerfile.backend
    ├── Dockerfile.frontend
    ├── docker-compose.yml
    └── nginx.conf
```

## License

MIT
