# 📓 LearnLog — Student Learning Journal

> A full-stack journaling and productivity app built for students to track their daily learning, manage study sessions, and reflect on their progress — all in one place.

---

## 🧠 What is LearnLog?

LearnLog is a personal learning companion designed for students who want to stay intentional about what they study. Instead of letting your learning disappear into thin air, LearnLog gives you a space to log it, time it, and review it — every single day.

Whether you just finished a tough DSA problem, completed a module, or spent 45 minutes reading documentation, LearnLog captures it with context — topic, description, difficulty, and duration — so your growth is always visible.

---

## ✨ Features

- 🔐 **Authentication** — Register, Login, Email OTP Verification, Forgot Password
- 📝 **Learning Journal** — Create, read, update, and delete daily learning entries with topic, description, study duration, and difficulty level
- ⏱️ **Focus Timer** — Full-page immersive study timer that logs your session directly as a journal entry when done
- 📊 **Dashboard** — See your total entries, accumulated study hours, weekly learning summary, and productivity overview at a glance
- 🔍 **Search & Filter** — Find entries by topic name, filter by difficulty level or date
- 👤 **Profile** — View and update your personal info, bio, and profile photo
- 📱 **Responsive Design** — Clean, mobile-first UI that works across all screen sizes

---

## 🛠️ Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Email | Nodemailer (OTP verification) |
| File Upload | Multer |

### Frontend
| Layer | Technology |
|-------|-----------|
| Library | React (JSX) |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| HTTP Client | Axios |

---

## 🗂️ API Overview

### Auth — `/api/auth`
- `POST /register` — Register a new student
- `POST /login` — Login and receive JWT
- `POST /email-verification` — Verify email via OTP

### Journal — `/api/journals` *(Protected)*
- `POST /` — Create a new journal entry
- `GET /` — Get all entries for logged-in student
- `GET /:id` — Get a single entry
- `PUT /:id` — Update an entry
- `DELETE /:id` — Delete an entry

### Dashboard — `/api/dashboard` *(Protected)*
- `GET /` — Fetch aggregated stats (total entries, study hours, productivity metrics)

### Profile — `/api/profile` *(Protected)*
- `GET /` — View profile info
- `PUT /` — Update bio and basic info
- `POST /upload-photo` — Upload profile picture

---

## 🏗️ Project Structure

```
LearnLog/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
└── frontend/
    └── src/
        ├── features/
        │   ├── auth/
        │   ├── journal/
        │   ├── dashboard/
        │   ├── timer/
        │   └── profile/
        ├── components/
        ├── routes/
        └── app/
```

---

## 👨‍💻 Development Approach

The **backend** was designed and built independently — every API, database model, authentication flow, middleware, and business logic was thought through and written from scratch. This included setting up JWT-based protected routes, OTP email verification, file upload handling, and aggregation queries for the dashboard.

The **frontend** was architected with a strict feature-based folder structure and built with the assistance of AI agents, which helped accelerate UI development while keeping the component logic clean, readable, and well-organised. Every design decision, route structure, and state management pattern was planned before implementation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
# create a .env file with the following:
# PORT, MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Project Context

Built as part of the **FS-34 Full Stack Batch**
Project name: **DayStack — Student Learning Journal**
Project Deadline: May 18, 2025

---

## 📄 License

This project is for educational purposes.
