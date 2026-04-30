import React from 'react'

const MinimalApp = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white max-w-2xl mx-auto p-8">
        <h1 className="text-5xl font-bold mb-6 text-red-600">YouTube Clone</h1>
        <p className="text-xl text-gray-300 mb-8">
          Welcome to YouTube Clone! The app is working.
        </p>
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Environment Info:</h3>
            <p className="text-sm text-gray-400">
              Mode: {import.meta.env.MODE}
            </p>
            <p className="text-sm text-gray-400">
              API URL: {import.meta.env.VITE_API_URL || 'Not set'}
            </p>
            <p className="text-sm text-gray-400">
              Production: {import.meta.env.PROD ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Next Steps:</h3>
            <p className="text-sm text-gray-400">
              If you can see this message, the basic app is working. 
              The issue might be with API connectivity or component loading.
            </p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Test Refresh
        </button>
      </div>
    </div>
  )
}

export default MinimalApp
