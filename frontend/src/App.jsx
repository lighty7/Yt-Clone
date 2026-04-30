import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicRoute from './components/common/PublicRoute'
import YouTubeFeed from './components/video/YouTubeFeed'
import YouTubeHeader from './components/layout/YouTubeHeader'
import YouTubeSidebar from './components/layout/YouTubeSidebar'
import VideoUpload from './components/video/VideoUpload'
import UserProfile from './components/video/UserProfile'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import ForgotPassword from './components/Auth/ForgotPassword'
import ResetPassword from './components/Auth/ResetPassword'
import VerifyEmail from './components/VerifyEmail'
import DashboardIndex from './components/Dashboard/Index'
import LoadingScreen from './components/common/LoadingScreen'
import TestComponent from './components/TestComponent'
import MinimalApp from './components/MinimalApp'
import ErrorFallback from './components/ErrorFallback'

// Error boundary component for production debugging
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
    if (import.meta.env.PROD) {
      // In production, log to external service or show user-friendly error
      console.error('Production Error:', {
        error: error.message,
        stack: error.stack,
        errorInfo,
        timestamp: new Date().toISOString()
      })
    }
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

  // Add error boundary for runtime errors
  const [hasError, setHasError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  React.useEffect(() => {
    // Catch any unhandled errors
    const handleError = (error) => {
      console.error('App Error:', error)
      setHasError(true)
      setErrorMessage(error.message || 'An unexpected error occurred')
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleError)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleError)
    }
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-400 mb-4">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingScreen message={loadingMessage} />
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <YouTubeHeader />
      <div className="flex">
        <YouTubeSidebar />
        <main className="flex-1">
          <Routes>
            {/* Public routes - only accessible when not logged in */}
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
            
            {/* Protected routes - only accessible when logged in */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardIndex /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><VideoUpload /></ProtectedRoute>} />
            
            {/* Public feed */}
            <Route path="/" element={<YouTubeFeed />} />

            {/* Profile management */}
            <Route 
              path="/me" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  // Debug logging for production
  if (import.meta.env.PROD) {
    console.log('🚀 App starting...', {
      mode: import.meta.env.MODE,
      apiUrl: import.meta.env.VITE_API_URL
    })
  }
  
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
