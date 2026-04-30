import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const UserProfile = () => {
	const { user } = useAuth()
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

	useEffect(() => {
		if (!user) return
		async function load() {
			setLoading(true)
			const res = await fetch(`${apiBase}/api/posts/me/mine`, {
				headers: { 'Authorization': `Bearer ${user.token}` }
			})
			const data = await res.json()
			if (res.ok) setPosts(data.posts || [])
			setLoading(false)
		}
		load()
	}, [user, apiBase])

	const deletePost = async (id) => {
		const res = await fetch(`${apiBase}/api/posts/${id}`, {
			method: 'DELETE',
			headers: { 'Authorization': `Bearer ${user.token}` }
		})
		if (res.ok) setPosts(prev => prev.filter(p => p.id !== id))
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white px-4 py-6">
			<div className="max-w-2xl mx-auto space-y-4">
				<h1 className="text-2xl font-semibold">My Posts</h1>
				{loading && <p>Loading...</p>}
				{posts.map(p => (
					<div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
						<p className="text-gray-200 whitespace-pre-wrap">{p.content}</p>
						{p.video_url && (
							<div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center text-sm text-gray-400">
								Video preview coming soon
							</div>
						)}
						<div className="flex gap-2">
							<button onClick={() => deletePost(p.id)} className="px-3 py-1 bg-red-600 rounded-lg">Delete</button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default UserProfile


