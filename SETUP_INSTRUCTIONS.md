# YouTube Clone - Full Setup Instructions

## Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/yt_clone"
   JWT_SECRET="your_secret"
   FRONTEND_URL="http://localhost:5173"

   # SMTP for email verification
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="user@gmail.com"
   SMTP_PASS="pass"
   ```

3. **Database Initialization**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start Backend**
   ```bash
   npm run dev
   ```

## Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Start Frontend**
   ```bash
   npm run dev
   ```

## New Features & Architecture

### Streaming & Bandwidth
Videos are served via `/api/posts/stream/:id`. This endpoint supports HTTP Range requests, allowing:
- Fast seeking (skipping forward/backward).
- Lower bandwidth usage (only loading what is needed).
- Browser-native video buffering.

### Engagement & Feed
- **Scoring**: Videos are ranked based on a weighted algorithm:
  `Score = (Likes * 1.5) - (Dislikes * 1) + (Comments * 2) + (Views * 0.1)`
- **Interactions**: Like, Dislike, Comment, and Subscribe are fully functional.

### Infrastructure
The included `nginx/nginx.conf` is pre-configured for:
- Large file uploads (500MB).
- Gzip compression for API responses.
- Optimized worker connections for handling concurrent video requests.

## API Reference

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login

### Videos
- `GET /api/posts` - Get ranked feed
- `GET /api/posts/stream/:id` - Stream video file
- `POST /api/posts` - Upload video/thumbnail

### Interactions
- `POST /api/likes/toggle` - Like/Dislike
- `POST /api/subscriptions/toggle` - Subscribe/Unsubscribe
- `POST /api/comments` - Add comment
