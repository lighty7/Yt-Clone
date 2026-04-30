import React, { useState, useEffect } from 'react'
import { API_URL } from '../config/api'
import { AuthContext } from './AuthContext.js'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Initializing...')

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token')
    
    // Add API health check first
    const checkApiHealth = async () => {
      try {
        const healthResponse = await fetch(`${API_URL}/health`)
        if (!healthResponse.ok) {
          throw new Error(`API health check failed: ${healthResponse.status}`)
        }
        console.log('✅ API health check passed')
      } catch (error) {
        console.error('❌ API health check failed:', error.message)
        if (import.meta.env.PROD) {
          console.error('🔧 API URL being used:', API_URL)
        }
        // Don't throw here, just log the error and continue
      }
    }

    const initializeAuth = async () => {
      try {
        setLoadingMessage('Checking API connection...')
        await checkApiHealth()
        
        if (token) {
          setLoadingMessage('Validating user session...')
          // Validate token with backend
          try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })
            
            if (!response.ok) {
              throw new Error(`Token validation failed: ${response.status}`)
            }
            
            const data = await response.json()
            if (data.user) {
              setUser({ ...data.user, token })
            } else {
              localStorage.removeItem('token')
            }
          } catch (error) {
            console.warn('Token validation failed:', error.message)
            localStorage.removeItem('token')
            // Log more details in production for debugging
            if (import.meta.env.PROD) {
              console.error('Auth error details:', {
                error: error.message,
                url: `${API_URL}/api/auth/me`,
                timestamp: new Date().toISOString()
              })
            }
          }
        }
        
        setLoadingMessage('Loading complete')
      } catch (error) {
        console.error('Auth initialization failed:', error)
        // Continue loading even if API is down
      } finally {
        setLoading(false)
      }
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ Auth initialization timeout - continuing anyway')
      setLoading(false)
    }, 5000) // 5 second timeout for faster loading

    initializeAuth().finally(() => {
      clearTimeout(timeoutId)
    })
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
    }
  }, []) // Empty dependency array is correct - we only want this to run once on mount

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setUser({ ...data.user, token: data.token })
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch {
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setUser({ ...data.user, token: data.token })
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch {
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    loadingMessage
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
