import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
	const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match')
			return
		}
		setLoading(true)
		try {
			const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
			const res = await fetch(`${apiBase}/api/auth/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
			})
			const data = await res.json()
			if (res.ok) {
				// Show success message and redirect to verification page
				setError('')
				alert('Account created successfully! Please check your email to verify your account before logging in.')
				navigate('/verify-email')
			} else {
				setError(data.message || 'Failed to create account')
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
						<h2 className="text-3xl font-semibold text-white mb-2">Create Account</h2>
						<p className="text-gray-400">Join us today</p>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
							<p className="text-red-400 text-sm">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
							<input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm" placeholder="Enter your full name" />
						</div>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
							<input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm" placeholder="Enter your email" />
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
							<input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm" placeholder="Create a password (min 6 characters)" />
						</div>
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
							<input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength="6" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm" placeholder="Confirm your password" />
						</div>
						<button type="submit" disabled={loading} className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
							{loading ? 'Creating Account...' : 'Create Account'}
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-gray-400">Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link></p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Signup


