# Environment Setup Guide

## Development Environment

Create a `.env` file in the `backend` directory with the following variables:

```env
# Environment
NODE_ENV=development

# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Authentication
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRES_IN=7d

# Email (SMTP) - Optional for development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=no-reply@yourdomain.com
```

## Production Environment (Render)

Set these environment variables in your Render dashboard:

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yt-clone-blond.vercel.app
DATABASE_URL=<your-supabase-postgres-url>
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<your-email>
SMTP_PASS=<your-app-password>
SMTP_FROM=no-reply@yourdomain.com
```

## Frontend Environment

### Development (`.env.local`)
```env
VITE_API_URL=http://localhost:3000
```

### Production (Vercel)
Set in `vercel.json`:
```json
"env": {
  "VITE_API_URL": "https://yt-clone-il3g.onrender.com"
}
```

## Notes

- **Never commit `.env` files** to git!
- In development, backend allows all `localhost` origins
- In production, backend only allows Vercel domains
- Frontend automatically uses correct API URL based on NODE_ENV
