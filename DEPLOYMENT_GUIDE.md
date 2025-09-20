# 🚀 Deployment Guide - YouTube Clone

## 📋 Overview

This guide covers deploying your YouTube Clone application to:
- **Frontend**: Vercel (https://yt-clone-blond.vercel.app)
- **Backend**: Render (https://yt-clone-il3g.onrender.com)

## 🔧 Environment Configuration

### Frontend Environment Variables

#### Development (.env.local)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=YouTube Clone (Dev)
```

#### Production (Vercel)
```env
VITE_API_URL=https://yt-clone-il3g.onrender.com
VITE_APP_NAME=YouTube Clone
```

### Backend Environment Variables

#### Development (.env)
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yt_clone_dev
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
VERIFICATION_TOKEN_EXPIRES_IN=24h
```

#### Production (Render)
```env
NODE_ENV=production
PORT=3000
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=yt_clone_prod
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_SSL=true
JWT_SECRET=your_super_secret_jwt_key_for_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://yt-clone-blond.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
VERIFICATION_TOKEN_EXPIRES_IN=24h
```

## 🎯 Frontend Deployment (Vercel)

### 1. Prepare Frontend for Production

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm run preview
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add VITE_API_URL production
# Enter: https://yt-clone-il3g.onrender.com
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables:
   - `VITE_API_URL` = `https://yt-clone-il3g.onrender.com`

### 3. Configure Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Update CORS configuration in backend

## 🎯 Backend Deployment (Render)

### 1. Prepare Backend for Production

```bash
cd backend

# Install dependencies
npm install

# Test production build
NODE_ENV=production npm start
```

### 2. Deploy to Render

#### Option A: Render Dashboard
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Name**: `yt-clone-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Option B: Using render.yaml
1. Push `render.yaml` to your repository
2. Render will automatically detect and use the configuration

### 3. Set Environment Variables in Render

Go to your service → Environment and add:

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yt-clone-blond.vercel.app
JWT_SECRET=your_super_secret_jwt_key_for_production
JWT_EXPIRES_IN=7d
VERIFICATION_TOKEN_EXPIRES_IN=24h
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
DB_HOST=your_production_db_host
DB_NAME=your_production_db_name
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_SSL=true
```

## 🗄️ Database Setup

### Option 1: Render PostgreSQL (Recommended)
1. Create PostgreSQL service in Render
2. Copy connection details to environment variables
3. Database will be automatically created

### Option 2: External Database
- **Neon**: https://neon.tech
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

## 📧 Email Service Setup

### Gmail SMTP Configuration
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Go to Google Account → Security → App passwords
   - Generate password for "Mail"
3. Use App Password in `SMTP_PASS` environment variable

### Alternative Email Services
- **SendGrid**: Professional email service
- **Mailgun**: Developer-friendly email API
- **AWS SES**: Scalable email service

## 🔒 Security Checklist

### Backend Security
- [ ] Strong JWT secret (32+ characters)
- [ ] Database credentials secured
- [ ] Email credentials secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Helmet security headers enabled

### Frontend Security
- [ ] API URL points to production backend
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced in production
- [ ] Environment variables properly configured

## 🧪 Testing Deployment

### 1. Test Backend API
```bash
# Test health endpoint
curl https://yt-clone-il3g.onrender.com/health

# Test CORS
curl -H "Origin: https://yt-clone-blond.vercel.app" \
     https://yt-clone-il3g.onrender.com/api/auth/me
```

### 2. Test Frontend
1. Visit https://yt-clone-blond.vercel.app
2. Try signup flow
3. Check email verification
4. Test login flow

### 3. Test Email Functionality
1. Sign up with real email
2. Check email for verification link
3. Click verification link
4. Verify account activation

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
```
Access to fetch at 'https://yt-clone-il3g.onrender.com' from origin 'https://yt-clone-blond.vercel.app' has been blocked by CORS policy
```

**Solution**: Check CORS configuration in backend

#### JWT Verification Failed
```
JWT verification failed
```

**Solution**: 
1. Check JWT_SECRET is set correctly
2. Ensure frontend and backend use same secret
3. Check token expiration

#### Email Not Sending
```
Email service connection failed
```

**Solution**:
1. Check SMTP credentials
2. Verify Gmail App Password
3. Check firewall/network restrictions

#### Database Connection Failed
```
Database connection failed
```

**Solution**:
1. Check database credentials
2. Verify database is accessible
3. Check SSL configuration

### Debug Commands

#### Backend Logs
```bash
# Check Render logs
# Go to Render dashboard → Your service → Logs
```

#### Frontend Logs
```bash
# Check Vercel logs
# Go to Vercel dashboard → Your project → Functions → Logs
```

## 📊 Monitoring

### Backend Monitoring
- **Render Dashboard**: Monitor CPU, Memory, Response times
- **Custom Logging**: Check application logs
- **Health Checks**: Monitor `/health` endpoint

### Frontend Monitoring
- **Vercel Analytics**: Monitor page views and performance
- **Error Tracking**: Monitor JavaScript errors
- **User Analytics**: Track user behavior

## 🔄 Continuous Deployment

### Automatic Deployments
- **Frontend**: Deploys automatically on push to main branch
- **Backend**: Deploys automatically on push to main branch

### Manual Deployments
```bash
# Frontend
vercel --prod

# Backend
# Push to main branch triggers automatic deployment
```

## 📈 Performance Optimization

### Backend Optimizations
- Enable gzip compression
- Optimize database queries
- Implement caching
- Monitor memory usage

### Frontend Optimizations
- Enable Vercel's CDN
- Optimize images
- Implement code splitting
- Use lazy loading

## 🎉 Success!

Once deployed, your YouTube Clone will be available at:
- **Frontend**: https://yt-clone-blond.vercel.app
- **Backend**: https://yt-clone-il3g.onrender.com

The application supports:
- ✅ User registration with email verification
- ✅ Secure authentication with JWT
- ✅ Email notifications
- ✅ Responsive design
- ✅ Production-ready security
