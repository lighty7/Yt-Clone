import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_URL } from '../../config/api'
import VideoCard from './VideoCard'

const VideoPlayer = () => {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const videoRef = useRef(null)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true)
      try {
        // Fetch main video
        const videoRes = await fetch(`${API_URL}/api/posts/${id}`)
        const videoData = await videoRes.json()

        if (videoRes.ok) {
          setVideo(videoData.post)
        } else {
          setError(videoData.message || 'Failed to load video')
        }

        // Fetch related videos (using same endpoint for now)
        const relatedRes = await fetch(`${API_URL}/api/posts`)
        const relatedData = await relatedRes.json()
        if (relatedRes.ok) {
          setRelatedVideos(relatedData.posts.filter(v => v.id.toString() !== id))
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        setError('Network error - Please check your connection')
      } finally {
        setLoading(false)
      }
    }

    fetchVideoData()
    window.scrollTo(0, 0)
  }, [id])

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`
    return `${views} views`
  }

  const formatTimeAgo = (date) => {
    if (!date) return ''
    const now = new Date()
    const videoDate = new Date(date)
    const diffInSeconds = Math.floor((now - videoDate) / 1000)
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen pt-4 px-4 lg:px-8">
        <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="aspect-video bg-gray-800 animate-pulse rounded-2xl mb-4" />
            <div className="h-8 bg-gray-800 animate-pulse rounded-lg w-3/4 mb-4" />
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-800 animate-pulse rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-800 animate-pulse rounded w-1/4" />
                <div className="h-3 bg-gray-800 animate-pulse rounded w-1/6" />
              </div>
            </div>
          </div>
          <div className="lg:w-[400px] space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex space-x-3">
                <div className="w-40 aspect-video bg-gray-800 animate-pulse rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-800 animate-pulse rounded" />
                  <div className="h-3 bg-gray-800 animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Video unavailable</h2>
        <p className="text-gray-400 mb-8 max-w-sm">{error || "The video you're looking for doesn't exist or has been removed."}</p>
        <Link to="/" className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
          Back to Home
        </Link>
      </div>
    )
  }

  const fullVideoUrl = video.videoUrl.startsWith('http') ? video.videoUrl : `${apiBase}${video.videoUrl}`

  return (
    <div className="bg-gray-900 min-h-screen pt-4 px-4 lg:px-8 pb-12">
      <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-6">

        {/* Main Player Area */}
        <div className="flex-1 min-w-0">
          {/* Video Container */}
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-4 group relative">
            <video
              ref={videoRef}
              src={fullVideoUrl}
              poster={video.thumbnailUrl ? `${apiBase}${video.thumbnailUrl}` : undefined}
              className="w-full h-full"
              controls
              autoPlay
            />
          </div>

          {/* Video Info */}
          <h1 className="text-xl font-bold text-white mb-4 line-clamp-2">{video.content}</h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
            {/* Channel Info */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-red-600 to-purple-600 rounded-full flex items-center justify-center border border-gray-700">
                <span className="text-white font-bold text-lg">{video.user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center">
                  <h3 className="font-bold text-white truncate mr-1">{video.user?.name}</h3>
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <p className="text-xs text-gray-400">1.2M subscribers</p>
              </div>
              <button
                onClick={() => setIsSubscribed(!isSubscribed)}
                className={`ml-4 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-bold transition-all ${
                  isSubscribed
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-800 rounded-full overflow-hidden">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700 border-r border-gray-700 transition-colors"
                >
                  <svg className={`w-5 h-5 ${isLiked ? 'fill-white text-white' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.757c1.274 0 1.911 1.54.1.1l-6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span className="text-sm font-bold">{isLiked ? (video.likes + 1) : video.likes}</span>
                </button>
                <button className="px-4 py-2 text-white hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.243c-1.274 0-1.911-1.54-.1-2.1l6.632-3.316m6.632 6l-6.632 3.316m0 0a3 3 0 10-5.367 2.684 3 3 0 005.367-2.684zm0-9.316a3 3 0 10-5.367-2.684 3 3 0 005.367 2.684z" />
                  </svg>
                </button>
              </div>
              <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="text-sm font-bold">Share</span>
              </button>
              <button className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Description Box */}
          <div className="mt-4 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors cursor-pointer group">
            <div className="flex items-center space-x-2 text-sm font-bold text-white mb-1">
              <span>{formatViews(video.views)}</span>
              <span>{formatTimeAgo(video.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
              {video.description || "No description provided."}
            </p>
            <button className="mt-2 text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Show more</button>
          </div>

          {/* Comments Section (Placeholder) */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-6">452 Comments</h3>
            <div className="flex items-start space-x-4 mb-8">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full bg-transparent border-b border-gray-700 py-1 text-sm text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Related Videos */}
        <div className="lg:w-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Up next</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-400">Autoplay</span>
              <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {relatedVideos.map(v => (
              <Link key={v.id} to={`/watch/${v.id}`} className="flex gap-3 group">
                <div className="w-40 h-[94px] bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 relative">
                  {v.thumbnailUrl ? (
                    <img src={`${apiBase}${v.thumbnailUrl}`} alt={v.content} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-bold text-white px-1 rounded">
                    {v.duration || '10:30'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white line-clamp-2 mb-1 group-hover:text-red-500 transition-colors leading-snug">
                    {v.content}
                  </h3>
                  <p className="text-[12px] text-gray-400 font-medium hover:text-white transition-colors mb-0.5">
                    {v.user?.name}
                  </p>
                  <p className="text-[12px] text-gray-500 font-medium">
                    {formatViews(v.views)} • {formatTimeAgo(v.createdAt)}
                  </p>
                </div>
              </Link>
            ))}

            {relatedVideos.length === 0 && (
              <p className="text-sm text-gray-500 italic">No related videos found</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default VideoPlayer
