import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const NavBar = () => {
	const { user, logout } = useAuth()
	const handleLogout = async () => {
		try {
			if (user?.token) {
				const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
				await fetch(`${apiBase}/api/auth/logout`, {
					method: 'POST',
					headers: { 'Authorization': `Bearer ${user.token}` }
				})
			}
		} finally {
			logout()
		}
	}

	return (
		<nav className="w-full bg-gray-900/80 backdrop-blur border-b border-white/10 text-white">
			<div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
				<Link to="/" className="font-semibold">YT Clone</Link>
				<div className="flex items-center gap-4">
					<Link to="/" className="text-gray-300 hover:text-white">Feed</Link>
					{user ? (
						<>
							<Link to="/me" className="text-gray-300 hover:text-white">My Posts</Link>
							<button onClick={handleLogout} className="px-3 py-1 rounded bg-red-600 hover:bg-red-700">Logout</button>
						</>
					) : (
						<>
							<Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
							<Link to="/signup" className="text-gray-300 hover:text-white">Signup</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	)
}

export default NavBar


