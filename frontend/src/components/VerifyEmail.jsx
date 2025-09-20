import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getApiUrl } from '../config/environment'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setStatus('error')
        setMessage('No verification token provided')
        return
      }

      try {
        const API_URL = getApiUrl()
        const response = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message)
          setUser(data.user)
        } else {
          setStatus('error')
          setMessage(data.message)
        }
      } catch (error) {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleResendVerification = async () => {
    if (!user?.email) return

    try {
      const API_URL = getApiUrl()
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Verification email sent successfully. Please check your email.')
      } else {
        setMessage(data.message || 'Failed to resend verification email')
      }
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            {status === 'verifying' && (
              <>
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">Verifying Email...</h2>
                <p className="text-gray-400">Please wait while we verify your email address.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">Email Verified!</h2>
                <p className="text-gray-400 mb-6">{message}</p>
                
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg inline-block text-center"
                  >
                    Go to Login
                  </Link>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">Verification Failed</h2>
                <p className="text-gray-400 mb-6">{message}</p>
                
                <div className="space-y-3">
                  <Link
                    to="/signup"
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg inline-block text-center"
                  >
                    Sign Up Again
                  </Link>
                  
                  {user?.email && (
                    <button
                      onClick={handleResendVerification}
                      className="w-full py-2 px-4 text-gray-400 hover:text-white transition-colors"
                    >
                      Resend Verification Email
                    </button>
                  )}
                  
                  <Link
                    to="/login"
                    className="w-full py-2 px-4 text-gray-400 hover:text-white transition-colors inline-block text-center"
                  >
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
