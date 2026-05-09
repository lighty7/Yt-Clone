import React, { useState, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../config/api'

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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [previews, setPreviews] = useState({ video: null, thumbnail: null })
  const [dragActive, setDragActive] = useState(false)

  const videoInputRef = useRef(null)

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files && files[0]) {
      const file = files[0]
      
      // Validation
      if (name === 'video' && !file.type.startsWith('video/')) {
        setError('Please select a valid video file')
        return
      }
      if (name === 'thumbnail' && !file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      setFormData(prev => ({ ...prev, [name]: file }))
      setError('')

      // Create preview
      const url = URL.createObjectURL(file)
      setPreviews(prev => ({ ...prev, [name]: url }))
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('video/')) {
        setFormData(prev => ({ ...prev, video: file }))
        setPreviews(prev => ({ ...prev, video: URL.createObjectURL(file) }))
        setError('')
      } else {
        setError('Please drop a valid video file')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.video) {
      setError('Video file is required')
      return
    }

    setUploading(true)
    setError('')

    const data = new FormData()
    data.append('video', formData.video)
    if (formData.thumbnail) data.append('thumbnail', formData.thumbnail)
    data.append('content', formData.title || formData.video.name.replace(/\.[^/.]+$/, ""))
    data.append('description', formData.description)
    data.append('duration', '3:45') // Hardcoded for now, ideally extracted from video

    try {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `${API_URL}/api/posts`, true)
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          navigate('/')
        } else {
          const response = JSON.parse(xhr.responseText)
          setError(response.message || 'Upload failed')
          setUploading(false)
        }
      }

      xhr.onerror = () => {
        setError('Network error. Please try again.')
        setUploading(false)
      }

      xhr.send(data)
    } catch (error) {
      console.error('Upload error:', error);
      setError('Something went wrong')
      setUploading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to upload</h2>
        <p className="text-gray-400 mb-8 text-center max-w-xs">Please log in to your account to start sharing your videos with the world.</p>
        <button onClick={() => navigate('/login')} className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20">
          Sign In Now
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Form */}
        <div className="flex-1">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
            <h1 className="text-2xl font-bold text-white mb-6">Video Details</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Title (required)</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Add a title that describes your video"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                  required
                  disabled={uploading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell viewers about your video"
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all resize-none"
                  disabled={uploading}
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Thumbnail</label>
                <div className="flex items-start space-x-4">
                  <div
                    onClick={() => !uploading && document.getElementById('thumb-input').click()}
                    className={`w-40 aspect-video bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-red-600 transition-colors overflow-hidden group ${uploading && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {previews.thumbnail ? (
                      <img src={previews.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-600 group-hover:text-red-500 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Upload</span>
                      </>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Select or upload a picture that shows what's in your video. A good thumbnail stands out and draws viewers' attention.
                    </p>
                  </div>
                  <input
                    type="file"
                    id="thumb-input"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-400">
                    <span>Uploading Video...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
                  disabled={uploading || !formData.video}
                >
                  {uploading ? 'Processing...' : 'Publish Video'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Preview & Upload Zone */}
        <div className="lg:w-[360px] space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">Video Preview</h2>
            <div
              className={`aspect-video bg-gray-900 rounded-xl overflow-hidden relative group border-2 ${dragActive ? 'border-red-600' : 'border-transparent'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {previews.video ? (
                <video src={previews.video} className="w-full h-full object-cover" controls />
              ) : (
                <div
                  onClick={() => !uploading && videoInputRef.current.click()}
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-white">Select video to upload</p>
                  <p className="text-xs text-gray-500 mt-1">Or drag and drop</p>
                </div>
              )}
              <input
                ref={videoInputRef}
                type="file"
                name="video"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-500 uppercase">File Name</span>
                <span className="text-xs text-gray-300 truncate ml-4 max-w-[200px]">{formData.video?.name || 'No file selected'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-500 uppercase">Video Link</span>
                <span className="text-xs text-blue-500 truncate ml-4">Waiting for upload...</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-blue-500 mb-2">Upload Tip</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              For best results, use a high-quality video file and ensure your title includes relevant keywords to help people find your content.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoUpload
