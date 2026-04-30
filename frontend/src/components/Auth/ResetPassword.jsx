import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const ResetPassword = () => {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [token, setToken] = useState('')

	useEffect(() => {
		const tokenParam = searchParams.get('token')
		if (!tokenParam) {
			setError('Invalid reset link. Please request a new password reset.')
		} else {
			setToken(tokenParam)
		}
	}, [searchParams])

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setMessage('')

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match')
			return
		}

		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters')
			return
		}

		setLoading(true)

		try {
			const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
			const res = await fetch(`${apiBase}/api/auth/reset-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					token, 
					password: formData.password 
				})
			})
			const data = await res.json()
			
			if (res.ok) {
				setMessage('Password updated successfully! You can now login with your new password.')
				setTimeout(() => {
					navigate('/login')
				}, 2000)
			} else {
				setError(data.message || 'Failed to reset password')
			}
		} catch {
			setError('Something went wrong. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	if (!token) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 px-4">
				<div className="w-full max-w-md">
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
						<div className="text-center">
							<div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</div>
							<h2 className="text-2xl font-semibold text-white mb-2">Invalid Reset Link</h2>
							<p className="text-gray-400 mb-6">{error}</p>
							<Link
								to="/forgot-password"
								className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg inline-block text-center"
							>
								Request New Reset Link
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 px-4">
			<div className="w-full max-w-md">
				<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-semibold text-white mb-2">Reset Password</h2>
						<p className="text-gray-400">Enter your new password</p>
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
							<label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">New Password</label>
							<input 
								type="password" 
								id="password" 
								name="password"
								value={formData.password} 
								onChange={handleChange}
								placeholder="Enter your new password" 
								className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
								required 
								minLength="6"
								disabled={loading} 
							/>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">Confirm New Password</label>
							<input 
								type="password" 
								id="confirmPassword" 
								name="confirmPassword"
								value={formData.confirmPassword} 
								onChange={handleChange}
								placeholder="Confirm your new password" 
								className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
								required 
								minLength="6"
								disabled={loading} 
							/>
						</div>
						
						<button 
							type="submit" 
							disabled={loading} 
							className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{loading ? 'Updating...' : 'Update Password'}
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

export default ResetPassword
