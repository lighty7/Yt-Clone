import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)


	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setMessage('')
		setLoading(true)

		try {
			const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
			const res = await fetch(`${apiBase}/api/auth/forgot-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			})
			const data = await res.json()
			
			if (res.ok) {
				setMessage(data.message || 'If the email exists, a reset link was sent')
			} else {
				setError(data.message || 'Failed to send reset email')
			}
		} catch {
			setError('Something went wrong. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 px-4">
			<div className="w-full max-w-md">
				<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-semibold text-white mb-2">Forgot Password</h2>
						<p className="text-gray-400">Enter your email to reset your password</p>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
							<p className="text-red-400 text-sm">{error}</p>
						</div>
					)}

					{message && (
						<div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
							<p className="text-green-400 text-sm">{message}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
							<input 
								type="email" 
								id="email" 
								value={email} 
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email address" 
								className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
								required 
								disabled={loading} 
							/>
						</div>
						
						<button 
							type="submit" 
							disabled={loading} 
							className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{loading ? 'Sending...' : 'Send Reset Link'}
						</button>
					</form>

					<div className="mt-6 text-center">
						<Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
							Back to Login
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ForgotPassword
