# 🚀 Deployment Guide - YouTube Clone

## 📋 Overview

This guide covers deploying your YouTube Clone application. It is optimized for:
- **Frontend**: Vercel
- **Backend**: Render or self-hosted Nginx/Node environment

## 🔧 Environment Configuration

### Frontend Environment Variables
Set these in your Vercel/deployment dashboard.
```env
VITE_API_URL=https://your-backend-api.com
```

### Backend Environment Variables
Set these in your Render/production environment.
```env
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=your_long_random_secret
FRONTEND_URL=https://your-frontend-domain.com
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-app-password
```

## 🎯 Frontend Deployment

### Vercel Dashboard
1. Connect your GitHub repository.
2. Root Directory: `frontend`
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add `VITE_API_URL` to Environment Variables.

## 🎯 Backend Deployment

### Render Dashboard
1. Connect your GitHub repository.
2. Root Directory: `backend`
3. Build Command: `npm install && npx prisma generate`
4. Start Command: `npm start`
5. Add all required Environment Variables.

### Self-Hosted (Nginx)
If self-hosting, use the provided `nginx/nginx.conf` which is optimized for video streaming:
- **Range Requests**: Enabled for efficient video seeking.
- **Compression**: Gzip enabled for fast metadata loading.
- **Max Body Size**: Set to `500M` for video uploads.

## 🗄️ Database Setup
The project uses **Prisma**. Ensure your database is reachable from the backend production environment.
- Run `npx prisma migrate deploy` to apply migrations in production.

## 🔒 Security Checklist
- [ ] **Rate Limiting**: Tiered limiting is enabled on `/api` (1000 reqs/15m) and `/api/auth` (50 reqs/1h).
- [ ] **JWT**: Ensure `JWT_SECRET` is at least 32 characters long.
- [ ] **CORS**: Ensure `FRONTEND_URL` in the backend matches your deployed frontend domain.
- [ ] **Streaming**: Use the `/api/posts/stream/:id` endpoint for optimal bandwidth management.

## 📈 Performance Tips
- Use the **Ranked Feed** for the home page to increase user engagement.
- Videos are served as streams; ensure your server has sufficient disk I/O for concurrent video requests.
