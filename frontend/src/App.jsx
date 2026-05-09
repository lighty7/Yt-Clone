import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicRoute from './components/common/PublicRoute'
import YouTubeFeed from './components/video/YouTubeFeed'
import YouTubeHeader from './components/layout/YouTubeHeader'
import YouTubeSidebar from './components/layout/YouTubeSidebar'
import VideoUpload from './components/video/VideoUpload'
import VideoPlayer from './components/video/VideoPlayer'
import UserProfile from './components/video/UserProfile'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import ForgotPassword from './components/Auth/ForgotPassword'
import ResetPassword from './components/Auth/ResetPassword'
import VerifyEmail from './components/VerifyEmail'
import DashboardIndex from './components/Dashboard/Index'
import LoadingScreen from './components/common/LoadingScreen'
import ErrorFallback from './components/ErrorFallback'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error} 
          resetError={() => {
            this.setState({ hasError: false, error: null })
          }}
        />
      )
    }

    return this.props.children
  }
}

function AppContent() {
  const { loading, loadingMessage } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  if (loading) {
    return <LoadingScreen message={loadingMessage} />
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <YouTubeHeader toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative overflow-hidden">
        <YouTubeSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 min-w-0 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar transition-all duration-300`}>
          <Routes>
            <Route path="/" element={<YouTubeFeed />} />
            <Route path="/watch/:id" element={<VideoPlayer />} />

            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              } 
            />
            <Route 
              path="/verify-email" 
              element={
                <PublicRoute>
                  <VerifyEmail />
                </PublicRoute>
              } 
            />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardIndex /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><VideoUpload /></ProtectedRoute>} />
            <Route path="/me" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
