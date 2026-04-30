import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const VideoCard = ({ video, onLike, onDislike, onComment }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [likes, setLikes] = useState(video.likes || 0)
  const [dislikes, setDislikes] = useState(video.dislikes || 0)

  const handleLike = async () => {
    if (isDisliked) {
      setIsDisliked(false)
      setDislikes(prev => prev - 1)
    }
    
    if (isLiked) {
      setIsLiked(false)
      setLikes(prev => prev - 1)
    } else {
      setIsLiked(true)
      setLikes(prev => prev + 1)
    }
    
    if (onLike) onLike(video.id)
  }

  const handleDislike = async () => {
    if (isLiked) {
      setIsLiked(false)
      setLikes(prev => prev - 1)
    }
    
    if (isDisliked) {
      setIsDisliked(false)
      setDislikes(prev => prev - 1)
    } else {
      setIsDisliked(true)
      setDislikes(prev => prev + 1)
    }
    
    if (onDislike) onDislike(video.id)
  }

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    }
    return `${views} views`
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const videoDate = new Date(date)
    const diffInSeconds = Math.floor((now - videoDate) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
    return `${Math.floor(diffInSeconds / 31536000)} years ago`
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-gray-700 rounded-t-lg overflow-hidden">
        {video.video_url ? (
          <video
            className="w-full h-full object-cover"
            poster={video.thumbnail_url}
            preload="metadata"
          >
            <source src={video.video_url} type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
          {video.duration || '10:30'}
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <div className="flex space-x-3">
          {/* Channel Avatar */}
          <div className="w-10 h-10 bg-red-500 rounded-full flex-shrink-0 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {video.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Video Title */}
            <h3 className="font-semibold text-white line-clamp-2 mb-1">
              {video.content || 'Amazing Video Title'}
            </h3>

            {/* Channel Name */}
            <p className="text-sm text-gray-300 mb-1">
              {video.user?.name || 'Channel Name'}
            </p>

            {/* Views and Time */}
            <p className="text-sm text-gray-400">
              {formatViews(video.views || 0)} • {formatTimeAgo(video.created_at)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isLiked
                  ? 'bg-red-900 text-red-400'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <svg className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span>{likes}</span>
            </button>

            {/* Dislike Button */}
            <button
              onClick={handleDislike}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isDisliked
                  ? 'bg-gray-700 text-gray-400'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <svg className={`w-4 h-4 ${isDisliked ? 'fill-current' : ''}`} viewBox="0 0 24 24">
                <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0h4v12h-4V3z"/>
              </svg>
              <span>{dislikes}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => onComment && onComment(video.id)}
              className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium text-gray-400 hover:bg-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{video.comments_count || 0}</span>
            </button>
          </div>

          {/* Share Button */}
          <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
