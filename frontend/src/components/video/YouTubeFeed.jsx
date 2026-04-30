import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { API_URL } from '../../config/api'
import VideoCard from './VideoCard'

const YouTubeFeed = () => {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/posts`)
      const data = await res.json()
      
      if (res.ok) {
        // Transform posts to video format for YouTube-like display
        const videoData = data.posts.map(post => ({
          id: post.id,
          content: post.content,
          video_url: post.video_url,
          thumbnail_url: post.thumbnail_url,
          duration: post.duration || '10:30',
          views: post.views || Math.floor(Math.random() * 1000000),
          likes: post.likes || Math.floor(Math.random() * 10000),
          dislikes: post.dislikes || Math.floor(Math.random() * 100),
          comments_count: post.comments_count || Math.floor(Math.random() * 100),
          created_at: post.created_at,
          user: {
            id: post.user_id,
            name: `User ${post.user_id}`,
            avatar: null
          }
        }))
        setVideos(videoData)
      } else {
        setError(data.message || 'Failed to load videos')
      }
    } catch (e) {
      setError('Network error - Please check your connection')
      console.error('Error loading videos:', e)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (videoId) => {
    try {
      await fetch(`${API_URL}/api/posts/${videoId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
    } catch (error) {
      console.error('Error liking video:', error)
    }
  }

  const handleDislike = async (videoId) => {
    // Implement dislike functionality
    console.log('Disliking video:', videoId)
  }

  const handleComment = (videoId) => {
    // Navigate to video page with comments
    console.log('Opening comments for video:', videoId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Videos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadVideos}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Recommended</h1>
          <p className="text-gray-400">Videos you might like</p>
        </div>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-6xl mb-4">📹</div>
            <h2 className="text-xl font-semibold text-white mb-2">No Videos Yet</h2>
            <p className="text-gray-400 mb-6">Be the first to upload a video!</p>
            {user && (
              <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Upload Video
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onLike={handleLike}
                onDislike={handleDislike}
                onComment={handleComment}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {videos.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
              Load More Videos
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default YouTubeFeed
