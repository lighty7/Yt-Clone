# 🎬 YouTube Clone

A modern, full-stack YouTube clone built with React, Node.js, Express, and PostgreSQL. Features user authentication, video uploads, and a responsive YouTube-like interface.

## 🌟 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Video Management**: Upload, view, and manage videos
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Dynamic content loading
- **Email Verification**: Account verification via email
- **Modern UI**: YouTube-inspired interface with dark theme
- **Production Ready**: Deployed on Vercel (frontend) and Render (backend)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Vercel)      │◄──►│   (Render)      │◄──►│   (Supabase)    │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Node.js       │    │ • PostgreSQL    │
│ • Vite          │    │ • Express       │    │ • Prisma ORM    │
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • Email Service │
│ • React Router  │    │ • CORS          │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Database ORM and migrations
- **JWT** - JSON Web Token authentication
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

### Database & Services
- **PostgreSQL** - Primary database (via Supabase)
- **Supabase** - Database hosting and management
- **Email Service** - SMTP email notifications

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## 🚀 Live Demo

- **Frontend**: [https://yt-clone-blond.vercel.app/](https://yt-clone-blond.vercel.app/)
- **Backend API**: [https://yt-clone-il3g.onrender.com](https://yt-clone-il3g.onrender.com)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (or Supabase account)
- **SMTP email service** (Gmail, SendGrid, etc.)

## 🏃‍♂️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/lighty7/Yt-Clone.git
cd Yt-Clone
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and email credentials

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## ⚙️ Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Application
NODE_ENV="development"
PORT="3000"
FRONTEND_URL="http://localhost:5173"
```

### Frontend (.env.local)

```env
VITE_API_URL="http://localhost:3000"
```

## 📁 Project Structure

```
Yt-Clone/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── prisma/             # Database schema & migrations
│   ├── tests/              # Test files
│   └── package.json
├── frontend/                # Frontend React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── common/     # Reusable components
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   ├── layout/     # Layout components
│   │   │   └── video/      # Video-related components
│   │   ├── config/         # Configuration
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   ├── public/             # Static assets
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Backend Scripts

```bash
npm run dev          # Start development server
npm start           # Start production server
npm run build       # Build for production
npm run prisma:studio  # Open Prisma Studio
npm run prisma:migrate  # Run database migrations
npm run prisma:generate  # Generate Prisma client
```

### Frontend Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` = your backend URL
4. Deploy automatically on push to main branch

### Backend (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables in Render dashboard
4. Deploy automatically on push to main branch

### Database (Supabase)

1. Create a new Supabase project
2. Copy the database URL and anon key
3. Add them to your backend environment variables
4. Run migrations: `npm run prisma:migrate`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email address

### Video Endpoints

- `GET /api/posts` - Get all videos
- `POST /api/posts` - Upload new video
- `GET /api/posts/:id` - Get video by ID
- `PUT /api/posts/:id` - Update video
- `DELETE /api/posts/:id` - Delete video

### Health Check

- `GET /health` - API health status

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

The backend includes comprehensive tests for:
- API health checks
- CORS configuration
- Error handling
- Basic endpoint functionality

### Frontend Tests
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all builds pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/lighty7/Yt-Clone/issues) page
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

## 🎯 Roadmap

- [ ] Video comments system
- [ ] User subscriptions
- [ ] Video recommendations
- [ ] Live streaming
- [ ] Mobile app (React Native)
- [ ] Advanced search and filters
- [ ] Video analytics dashboard

## 🙏 Acknowledgments

- YouTube for the design inspiration
- React team for the amazing framework
- Vercel and Render for hosting services
- Supabase for database hosting
- All contributors and supporters

---

**Made with ❤️ by [lighty7](https://github.com/lighty7)**
