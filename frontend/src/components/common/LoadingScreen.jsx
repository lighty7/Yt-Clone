import React from 'react'

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">YouTube Clone</h2>
        <p className="text-gray-400">{message}</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>If this takes too long, please check your connection</p>
          <p>or try refreshing the page</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
