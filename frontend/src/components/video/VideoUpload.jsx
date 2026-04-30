import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const VideoUpload = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null,
    thumbnail: null
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }))
      
      // Create preview for video
      if (name === 'video' && files[0]) {
        const url = URL.createObjectURL(files[0])
        setPreview(url)
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Please log in to upload videos')
      return
    }

    if (!formData.video) {
      setError('Please select a video file')
      return
    }

    setUploading(true)
    setError('')

    try {
      const uploadData = new FormData()
      uploadData.append('content', formData.title)
      uploadData.append('description', formData.description)
      uploadData.append('video', formData.video)
      if (formData.thumbnail) {
        uploadData.append('thumbnail', formData.thumbnail)
      }

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiBase}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: uploadData
      })

      const result = await response.json()

      if (response.ok) {
        navigate('/')
      } else {
        setError(result.message || 'Upload failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to upload videos.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Upload Video</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video File *
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleInputChange}
                  className="hidden"
                  id="video-upload"
                  required
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-lg font-medium text-white">
                    {formData.video ? formData.video.name : 'Choose video file'}
                  </span>
                  <span className="text-sm text-gray-400">
                    MP4, MOV, AVI up to 2GB
                  </span>
                </label>
              </div>
              
              {preview && (
                <div className="mt-4">
                  <video
                    src={preview}
                    controls
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter video title"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell viewers about your video"
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thumbnail (Optional)
              </label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VideoUpload
