import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { API_URL } from '../../config/api'
import VideoCard from './VideoCard'

const VideoPlayer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [video, setVideo] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userInteraction, setUserInteraction] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)

  // Comments state
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  const videoRef = useRef(null)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true)
      try {
        const headers = {}
        if (user?.token) {
          headers['Authorization'] = `Bearer ${user.token}`
        }

        const videoRes = await fetch(`${API_URL}/api/posts/${id}`, { headers })
        const videoData = await videoRes.json()

        if (videoRes.ok) {
          setVideo(videoData.post)
          setUserInteraction(videoData.post.userInteraction)
          setIsSubscribed(videoData.post.isSubscribed)
          setSubscriberCount(videoData.post.user?.subscriberCount || 0)
          fetchComments()
        } else {
          setError(videoData.message || 'Failed to load video')
        }

        const relatedRes = await fetch(`${API_URL}/api/posts`)
        const relatedData = await relatedRes.json()
        if (relatedRes.ok) {
          setRelatedVideos(relatedData.posts.filter(v => v.id.toString() !== id))
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        setError('Network error')
      } finally {
        setLoading(false)
      }
    }

    fetchVideoData()
    window.scrollTo(0, 0)
  }, [id, user])

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/comments/post/${id}`)
      const data = await res.json()
      if (res.ok) {
        setComments(data.comments)
      }
    } catch (e) {
      console.error('Error fetching comments:', e)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (!newComment.trim()) return

    setSubmittingComment(true)
    try {
      const res = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ postId: id, content: newComment })
      })
      const data = await res.json()
      if (res.ok) {
        setNewComment('')
        setComments(prev => [data.comment, ...prev])
      }
    } catch (e) {
      console.error('Error posting comment:', e)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return
    try {
      const res = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId))
      }
    } catch (e) {
      console.error('Error deleting comment:', e)
    }
  }

  const handleInteraction = async (type) => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/likes/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ postId: id, type })
      })
      const data = await res.json()
      if (res.ok) {
        setUserInteraction(data.interaction)
        const videoRes = await fetch(`${API_URL}/api/posts/${id}`)
        const videoData = await videoRes.json()
        if (videoRes.ok) {
          setVideo(prev => ({
            ...prev,
            likes: videoData.post.likes,
            dislikes: videoData.post.dislikes
          }))
        }
      }
    } catch (e) {
      console.error('Error toggling interaction:', e)
    }
  }

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/subscriptions/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ userId: video.userId })
      })
      const data = await res.json()
      if (res.ok) {
        setIsSubscribed(data.isSubscribed)
        setSubscriberCount(prev => data.isSubscribed ? prev + 1 : prev - 1)
      }
    } catch (e) {
      console.error('Error toggling subscription:', e)
    }
  }

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

  if (loading) return <div className="p-8 text-white">Loading...</div>
  if (error || !video) return <div className="p-8 text-white text-center">Video not found</div>

  // Use the optimized stream endpoint
  const streamUrl = `${API_URL}/api/posts/stream/${id}`;

  return (
    <div className="bg-gray-900 min-h-screen pt-4 px-4 lg:px-8 pb-12">
      <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-4 group relative">
            <video
              ref={videoRef}
              src={streamUrl}
              className="w-full h-full"
              controls
              autoPlay
            />
          </div>

          <h1 className="text-xl font-bold text-white mb-4">{video.content}</h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <Link to={`/profile/${video.userId}`} className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                {video.user?.avatar ? (
                  <img src={video.user.avatar.startsWith('http') ? video.user.avatar : `${apiBase}${video.user.avatar}`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-lg">{video.user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </Link>
              <div className="min-w-0">
                <Link to={`/profile/${video.userId}`} className="font-bold text-white hover:text-gray-300 transition-colors">{video.user?.name}</Link>
                <p className="text-xs text-gray-400">{formatViews(subscriberCount)} subscribers</p>
              </div>
              <button
                onClick={handleSubscribe}
                className={`ml-4 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  isSubscribed ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-800 rounded-full overflow-hidden">
                <button
                  onClick={() => handleInteraction('LIKE')}
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700 border-r border-gray-700 transition-colors"
                >
                  <svg className={`w-5 h-5 ${userInteraction === 'LIKE' ? 'fill-white' : ''}`} stroke="currentColor" viewBox="0 0 24 24" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.757c1.274 0 1.911 1.54.1.1l-6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span className="text-sm font-bold">{video.likes}</span>
                </button>
                <button
                  onClick={() => handleInteraction('DISLIKE')}
                  className="px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                >
                  <svg className={`w-5 h-5 ${userInteraction === 'DISLIKE' ? 'fill-white' : ''}`} stroke="currentColor" viewBox="0 0 24 24" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.243c-1.274 0-1.911-1.54-.1-2.1l6.632-3.316m6.632 6l-6.632 3.316m0 0a3 3 0 10-5.367 2.684 3 3 0 005.367-2.684zm0-9.316a3 3 0 10-5.367-2.684 3 3 0 005.367 2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-800/50 rounded-xl mb-8">
            <div className="flex items-center space-x-2 text-sm font-bold text-white mb-1">
              <span>{formatViews(video.views)}</span>
              <span>{formatTimeAgo(video.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{video.description}</p>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-6">{comments.length} Comments</h3>

            <form onSubmit={handleCommentSubmit} className="flex items-start space-x-4 mb-8">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0 overflow-hidden">
                {user?.avatar && <img src={user.avatar} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-transparent border-b border-gray-700 py-1 text-sm text-white focus:outline-none focus:border-white transition-colors"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full disabled:opacity-50"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="flex space-x-4 group">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0 overflow-hidden">
                    {comment.user?.avatar && <img src={comment.user.avatar} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-bold text-white">{comment.user?.name}</span>
                      <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-200">{comment.content}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      {user && user.id === comment.userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-xs text-gray-500 hover:text-red-500 font-bold"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-[400px] space-y-4">
          <h2 className="font-bold text-white mb-4">Up next</h2>
          {relatedVideos.map(v => (
            <Link key={v.id} to={`/watch/${v.id}`} className="flex gap-3 group">
              <div className="w-40 h-[94px] bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                {v.thumbnailUrl ? (
                  <img src={`${apiBase}${v.thumbnailUrl}`} alt={v.content} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">{v.content}</h3>
                <p className="text-[12px] text-gray-400 mt-1">{v.user?.name}</p>
                <p className="text-[12px] text-gray-500">{formatViews(v.views)} • {formatTimeAgo(v.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
