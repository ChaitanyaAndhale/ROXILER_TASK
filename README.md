# Store Rating Platform

A full-stack web application where users can browse stores and submit ratings. Built with Express.js, PostgreSQL (Prisma ORM), and React (Vite).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Validation | Joi |
| Frontend | React + Vite |
| HTTP client | Axios |

---

## Features

### Admin
- Dashboard showing total users, stores, and ratings
- Add users (any role) and stores
- View/filter/sort users and stores

### Normal User
- Sign up & log in
- Browse all stores with average ratings
- Search stores by name or address
- Submit or update a rating (1–5 stars)

### Store Owner
- View their store's average rating and total reviews
- See the list of users who rated their store

### All Roles
- Secure JWT login
- Update own password
- Role-based protected routes

---

## Project Structure

```
RoxilerAssess/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── controllers/    (authController, adminController, userController, ownerController)
│   │   ├── middleware/     (authMiddleware)
│   │   ├── routes/         (authRoutes, adminRoutes, userRoutes, ownerRoutes)
│   │   └── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/api.js
    │   ├── context/AuthContext.jsx
    │   ├── components/     (Navbar, ProtectedRoute)
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── UpdatePasswordPage.jsx
    │   │   ├── admin/      (AdminDashboard, AdminStores, AdminUsers)
    │   │   ├── user/       (UserHome)
    │   │   └── owner/      (OwnerDashboard)
    │   ├── App.jsx
    │   └── index.css
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL running locally

### 1. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials and a JWT secret
npm install
npx prisma migrate dev --name init
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit VITE_API_URL if needed (default: http://localhost:5000/api)
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`
---

## Test Credentials

### Admin
- **Email:** Chaitanyaandhale6@gmail.com
- **Password:** Admin@123

### User
- **Email:** liveff2017@gmail.com
- **Password:** User@123

### Store Owner
- **Email:** andhalec2@gmail.com
- **Password:** Owner@123

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/signup` | Public | Register new user |
| POST | `/login` | Public | Login all roles |
| PUT | `/update-password` | Any logged-in | Update password |

### Admin (`/api/admin`) — ADMIN only
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dashboard` | Stats: users, stores, ratings |
| POST | `/users` | Add user with any role |
| GET | `/users` | List users (filter: name, email, role; sort: asc/desc) |
| POST | `/stores` | Add store |
| GET | `/stores` | List stores (filter: name; sort: asc/desc) |

### User (`/api/user`) — USER only
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/stores` | Browse stores with avg rating and own rating |
| POST | `/ratings` | Submit or update rating (1–5) |

### Owner (`/api/owner`) — STORE_OWNER only
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/my-store` | View own store + avg rating |
| GET | `/raters` | List users who rated the store |

---

## Validation Rules

| Field | Rules |
|-------|-------|
| Name | 20–60 characters |
| Email | Valid email format |
| Password | 8–16 chars, 1 uppercase, 1 special character |
| Address | Max 400 characters |
| Rating | Integer 1–5 |

---

## Environment Variables

**Backend `.env`:**
```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/store_rating_db"
JWT_SECRET="your_super_secret_jwt_key_here"
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Roles

| Role | Created By | Access |
|------|-----------|--------|
| `USER` | Self-signup | Browse & rate stores |
| `STORE_OWNER` | Admin only | View own store stats |
| `ADMIN` | Admin only | Full admin panel |
