# YouTube Clone - Authentication Setup Instructions

## Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=yt_clone
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_SSL=false

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Email Configuration (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password

   # Frontend URL
   FRONTEND_URL=http://localhost:5173

   # Email Verification
   VERIFICATION_TOKEN_EXPIRES_IN=24h
   ```

3. **Database Setup**
   - Make sure PostgreSQL is running
   - Create a database named `yt_clone`
   - The application will automatically create tables on startup

4. **Email Configuration**
   - For Gmail: Use App Password (not your regular password)
   - Enable 2-factor authentication and generate an App Password
   - Update `SMTP_USER` and `SMTP_PASS` in your `.env` file

5. **Start Backend**
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

## Features Implemented

### Backend
- ✅ User registration with email verification
- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Email verification system with Nodemailer
- ✅ Login logs tracking
- ✅ Protected routes middleware
- ✅ Resend verification email functionality

### Frontend
- ✅ Signup form with validation
- ✅ Login form with error handling
- ✅ Email verification page
- ✅ Protected routes
- ✅ Feed page for authenticated users
- ✅ Modern UI with Tailwind CSS

## Authentication Flow

1. **Signup**: User creates account → Verification email sent
2. **Email Verification**: User clicks link → Account verified
3. **Login**: User logs in with verified account → JWT token issued
4. **Access**: User can access protected routes with valid JWT

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email?token=xxx` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `GET /api/auth/me` - Get current user (protected)

## Testing the Flow

1. Start both backend and frontend servers
2. Go to `http://localhost:5173/signup`
3. Create a new account
4. Check your email for verification link
5. Click the verification link
6. Go to `http://localhost:5173/login`
7. Login with your verified account
8. You should be redirected to the Feed page
