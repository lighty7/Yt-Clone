import React from 'react'

const ErrorFallback = ({ error, resetError }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-red-600">YouTube Clone</h1>
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Application Error</h2>
          <p className="text-gray-300 mb-4">
            Something went wrong while loading the application.
          </p>
          {error && (
            <details className="text-left">
              <summary className="cursor-pointer text-yellow-400 mb-2">
                Error Details (Click to expand)
              </summary>
              <pre className="text-xs text-gray-400 bg-gray-900 p-3 rounded overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
        </div>
        <div className="space-y-4">
          <button 
            onClick={resetError}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <p>If the problem persists, please check:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Your internet connection</li>
            <li>Browser console for additional errors</li>
            <li>Try refreshing the page</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ErrorFallback
