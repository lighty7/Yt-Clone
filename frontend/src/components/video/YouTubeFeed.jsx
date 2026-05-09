import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { API_URL } from '../../config/api'
import VideoCard from './VideoCard'

const YouTubeFeed = () => {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Gaming', 'Music', 'Live', 'Comedy', 'Technology', 'Sports', 'Cooking', 'Education']

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
        setVideos(data.posts || [])
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

  // Loading Skeletons
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen pt-4 px-4">
        {/* Category Skeletons */}
        <div className="flex space-x-3 mb-6 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-800 rounded-lg animate-pulse flex-shrink-0" />
          ))}
        </div>

        {/* Video Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-800 rounded-xl mb-3" />
              <div className="flex space-x-3">
                <div className="w-9 h-9 bg-gray-800 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center p-8 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Can't load feed</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={loadVideos}
            className="w-full px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Category Filter Bar */}
      <div className="sticky top-[64px] z-40 bg-gray-900/95 backdrop-blur-md px-4 py-3 border-b border-gray-800">
        <div className="flex space-x-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No videos yet</h2>
            <p className="text-gray-400 max-w-sm mb-8">Be the first one to share a video with the community!</p>
            {user && (
              <button
                onClick={() => window.location.href = '/upload'}
                className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 shadow-lg shadow-red-900/20 transition-all"
              >
                Upload a Video
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default YouTubeFeed
