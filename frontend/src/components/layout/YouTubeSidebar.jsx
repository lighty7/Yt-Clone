import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const YouTubeSidebar = () => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔥', label: 'Trending', path: '/trending' },
    { icon: '📺', label: 'Subscriptions', path: '/subscriptions' },
    { icon: '📚', label: 'Library', path: '/library' },
    { icon: '🕒', label: 'History', path: '/history' },
    { icon: '📹', label: 'Your Videos', path: '/my-videos' },
    { icon: '⏰', label: 'Watch Later', path: '/watch-later' },
    { icon: '👍', label: 'Liked Videos', path: '/liked' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside className={`bg-gray-900 border-r border-gray-700 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-700 rounded-full mb-4 text-gray-300"
        >
          <svg className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-red-900 text-red-400'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {!collapsed && (
          <div className="mt-8 pt-4 border-t border-gray-700">
            <h3 className="px-3 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Explore
            </h3>
            <div className="space-y-1">
              {['Music', 'Gaming', 'News', 'Sports', 'Learning'].map((category) => (
                <button
                  key={category}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg w-full text-left"
                >
                  <span className="text-lg">🎵</span>
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default YouTubeSidebar
