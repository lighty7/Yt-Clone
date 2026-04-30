import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const PostComposer = ({ onPosted }) => {
	const { user } = useAuth()
	const [content, setContent] = useState('')
	const [videoUrl, setVideoUrl] = useState('')
	const [loading, setLoading] = useState(false)
	const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

	const submit = async (e) => {
		e.preventDefault()
		if (!user) return
		setLoading(true)
		try {
			const res = await fetch(`${apiBase}/api/posts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${user.token}`,
				},
				body: JSON.stringify({ content, video_url: videoUrl || null }),
			})
			const data = await res.json()
			if (res.ok) {
				setContent('')
				setVideoUrl('')
				onPosted && onPosted(data.post)
			}
		} finally {
			setLoading(false)
		}
	}

	if (!user) return null

	return (
		<form onSubmit={submit} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Share something..."
				className="w-full bg-transparent border border-white/10 rounded-lg p-3 text-white"
				rows={3}
			/>
			<input
				value={videoUrl}
				onChange={(e) => setVideoUrl(e.target.value)}
				placeholder="Optional video URL"
				className="w-full bg-transparent border border-white/10 rounded-lg p-3 text-white"
			/>
			<button disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700">
				{loading ? 'Posting...' : 'Post'}
			</button>
		</form>
	)
}

export default PostComposer


