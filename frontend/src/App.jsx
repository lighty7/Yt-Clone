import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import Dashboard from './components/Dashboard'
import Feed from './components/Feed'
import Signup from './components/Signup'
import Login from './components/Login'
import VerifyEmail from './components/VerifyEmail'

function App() {
  return (
    <Router>
      <AuthProvider>
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
          
          {/* Email verification route - accessible to everyone */}
          <Route 
            path="/verify-email" 
            element={<VerifyEmail />} 
          />
          
          {/* Protected routes - only accessible when logged in */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/feed" 
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to appropriate page */}
          <Route path="/" element={<Navigate to="/feed" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
