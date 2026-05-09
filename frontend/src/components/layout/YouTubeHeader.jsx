import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

const YouTubeHeader = ({ toggleSidebar }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 h-[64px] flex items-center">
      <div className="flex items-center justify-between px-4 w-full">
        {/* Left: Logo and Menu */}
        <div className="flex items-center space-x-4 min-w-[200px]">
          <button
            onClick={toggleSidebar}
            className="p-2.5 hover:bg-gray-800 rounded-full text-white transition-colors active:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="flex items-center space-x-1.5 group">
            <div className="w-9 h-7 bg-red-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
            </div>
            <span className="text-xl font-bold text-white tracking-tighter">YouTube<span className="font-normal text-[10px] align-top ml-0.5 text-gray-400">CLONE</span></span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="flex w-full group">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-4 group-focus-within:pl-11 pr-4 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-l-full focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 bg-gray-800 border border-l-0 border-gray-700 rounded-r-full hover:bg-gray-700 transition-colors"
              title="Search"
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button type="button" className="ml-3 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors border border-transparent hover:border-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          <button className="md:hidden p-2.5 hover:bg-gray-800 rounded-full text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {user ? (
            <>
              <Link
                to="/upload"
                className="p-2.5 hover:bg-gray-800 rounded-full text-white transition-colors"
                title="Create"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </Link>

              <button className="hidden sm:block p-2.5 hover:bg-gray-800 rounded-full text-white" title="Notifications">
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM9 12l2 2 4-4" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1 rounded-full border border-gray-900">9+</span>
                </div>
              </button>

              <div className="relative ml-1">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-red-600 to-purple-600 rounded-full flex items-center justify-center border border-gray-700 hover:border-white transition-colors overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-5 py-3 flex items-center space-x-4 border-b border-gray-700 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-bold text-white truncate">{user.name}</p>
                          <p className="text-sm text-gray-400 truncate">{user.email}</p>
                          <Link to="/me" className="text-blue-500 text-sm font-medium hover:text-blue-400 mt-1 inline-block">Manage your account</Link>
                        </div>
                      </div>

                      <Link to="/me" className="flex items-center px-5 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors">
                        <svg className="w-5 h-5 mr-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Your Channel
                      </Link>
                      <Link to="/dashboard" className="flex items-center px-5 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors">
                        <svg className="w-5 h-5 mr-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        YouTube Studio
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-5 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors border-t border-gray-700 mt-2"
                      >
                        <svg className="w-5 h-5 mr-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 text-sm font-bold text-blue-500 hover:bg-blue-500/10 rounded-full border border-gray-700 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-bold bg-white text-black hover:bg-gray-200 rounded-full transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default YouTubeHeader
