# 🎬 YouTube Clone

A modern, full-stack YouTube clone built with React, Node.js, Express, and PostgreSQL. Features user authentication, video uploads, interactions (likes/comments), subscriptions, and a responsive YouTube-inspired interface.

## 🌟 Features

- **User Authentication**: Secure signup/login with JWT tokens and email verification.
- **Video Management**: High-performance video uploads and optimized streaming.
- **Engagement System**: Like/Dislike videos, post and delete comments, and reply to existing comments.
- **Subscription System**: Subscribe to creators and track subscriber counts in real-time.
- **Personalized Library**: Access your watch history, liked videos, and watch later list.
- **Ranked Feed**: Smart home feed ranking based on engagement (likes, views, and comments).
- **Responsive Design**: Mobile-first interface with a collapsible sidebar and adaptive grids.
- **Production Ready**: Optimized Nginx configuration, robust rate limiting, and security headers.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Vercel)      │◄──►│   (Render/Nginx)│◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Node.js       │    │ • Prisma ORM    │
│ • Vite          │    │ • Express       │    │ • JWT Auth      │
│ • Tailwind CSS  │    │ • Range Stream  │    │ • Like/Sub Logic│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features.
- **Vite** - Fast build tool and dev server.
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development.
- **React Router 7** - Client-side routing with active state highlighting.
- **Context API** - Global state management for authentication.

### Backend
- **Node.js & Express.js** - Robust server-side runtime and framework.
- **Prisma** - Modern ORM for type-safe database access and migrations.
- **JWT** - Secure JSON Web Token authentication.
- **Multer** - Middleware for handling multipart/form-data (file uploads).
- **Security**: Helmet, CORS, and tiered rate limiting.

### Infrastructure
- **Nginx** - Reverse proxy optimized for high-volume video serving with Gzip and efficient buffering.
- **PostgreSQL** - Relational database for persistent storage.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** instance
- **SMTP email service** (for verification)

## 🏃‍♂️ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/lighty7/Yt-Clone.git
cd Yt-Clone
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env # Update with your DATABASE_URL and JWT_SECRET
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Key Configurations

### Optimized Streaming
The backend supports **HTTP Range requests**, allowing users to skip to any part of a video instantly and enabling browser-level bandwidth management.

### Ranked Feed Algorithm
Videos are ranked using an engagement score:
`Score = (Likes * 1.5) - (Dislikes * 1) + (Comments * 2) + (Views * 0.1)`

### Security
- **Auth Rate Limit**: 50 attempts/hour.
- **API Rate Limit**: 1000 requests/15 minutes.
- **Upload Limit**: 500MB per video.

## 📁 Project Structure

```
Yt-Clone/
├── backend/                 # Node.js/Express API
│   ├── prisma/             # Schema and Migrations
│   ├── src/
│   │   ├── controllers/    # Business logic (Post, User, Like, etc.)
│   │   ├── routes/         # API endpoints
│   │   └── libs/           # Security and config
├── frontend/                # React 19 App
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     # Header, Sidebar
│   │   │   └── video/      # Player, Feeds, Cards
│   │   └── contexts/       # Auth state
├── nginx/                   # Nginx configuration
└── docker-compose.yml       # Container orchestration
```

## 🚀 Deployment

- **Frontend**: Deploy `frontend/` to Vercel/Netlify. Ensure `VITE_API_URL` points to your backend.
- **Backend**: Deploy `backend/` to Render/Railway. Ensure `DATABASE_URL` and `JWT_SECRET` are set.
- **Static Assets**: Use the optimized Nginx config in `nginx/` for serving uploads in a self-hosted environment.

---

**Built with ❤️ for the community.**
