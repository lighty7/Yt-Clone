import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FeedV } from './feed/FeedV'

const Feed = () => {
  const { user, logout } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading videos
    const loadVideos = async () => {
      try {
        // In a real app, you would fetch videos from your API
        // const response = await fetch('/api/videos')
        // const data = await response.json()
        // setVideos(data)
        
        // Mock data for now
        setTimeout(() => {
          setVideos([
            {
              id: 1,
              title: 'Welcome to YouTube Clone!',
              description: 'This is your personalized feed. Start exploring amazing content!',
              thumbnailUrl: 'https://via.placeholder.com/320x180/667eea/ffffff?text=Welcome',
              views: 1234,
              uploader: 'YouTube Clone Team',
              duration: '2:30'
            },
            {
              id: 2,
              title: 'How to Get Started',
              description: 'Learn the basics of using our platform.',
              thumbnailUrl: 'https://via.placeholder.com/320x180/764ba2/ffffff?text=Getting+Started',
              views: 567,
              uploader: 'Tutorial Team',
              duration: '5:15'
            },
            {
              id: 3,
              title: 'Amazing Features',
              description: 'Discover all the cool features we have to offer.',
              thumbnailUrl: 'https://via.placeholder.com/320x180/f093fb/ffffff?text=Features',
              views: 890,
              uploader: 'Feature Team',
              duration: '3:45'
            }
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error loading videos:', error)
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-400">Loading your feed...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">YouTube Clone</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-300">{user?.name}</span>
              </div>
              
              <button
                onClick={logout}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-gray-400">Here's what's new in your feed</p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="relative" onClick={<FeedV videoId={video.id}/>}>
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{video.uploader}</span>
                  <span>{video.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {videos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No videos yet</h3>
            <p className="text-gray-400 mb-6">Check back later for new content!</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Feed
