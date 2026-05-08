import React from 'react'
import { useNavigate } from 'react-router-dom'

const VideoCard = ({ video }) => {
  const navigate = useNavigate()

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    }
    return `${views} views`
  }

  const formatTimeAgo = (date) => {
    if (!date) return 'Unknown'
    const now = new Date()
    const videoDate = new Date(date)
    const diffInSeconds = Math.floor((now - videoDate) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
    return `${Math.floor(diffInSeconds / 31536000)}y ago`
  }

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const fullThumbnailUrl = video.thumbnailUrl
    ? (video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${apiBase}${video.thumbnailUrl}`)
    : null

  return (
    <div className="flex flex-col group cursor-pointer" onClick={() => navigate(`/watch/${video.id}`)}>
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden mb-3 transition-all duration-200 group-hover:rounded-none">
        {fullThumbnailUrl ? (
          <img
            src={fullThumbnailUrl}
            alt={video.content}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
            <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          {video.duration || '10:30'}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Video Metadata */}
      <div className="flex space-x-3 px-1">
        {/* Channel Avatar */}
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-tr from-red-600 to-purple-600 rounded-full flex items-center justify-center border border-gray-700">
            <span className="text-white font-bold text-xs">
              {video.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug mb-1 group-hover:text-red-500 transition-colors">
            {video.content || 'Untitled Video'}
          </h3>

          {/* Channel Name */}
          <div className="flex items-center text-xs text-gray-400 font-medium mb-0.5 hover:text-white transition-colors">
            {video.user?.name || 'Anonymous Creator'}
            <svg className="w-3 h-3 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>

          {/* Views & Time */}
          <div className="text-xs text-gray-500 font-medium">
            {formatViews(video.views || 0)} • {formatTimeAgo(video.createdAt)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
