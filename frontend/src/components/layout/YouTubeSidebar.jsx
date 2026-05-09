import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const YouTubeSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()

  const mainLinks = [
    { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, label: 'Home', path: '/' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>, label: 'Shorts', path: '/shorts' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>, label: 'Subscriptions', path: '/subscriptions' },
  ]

  const libraryLinks = [
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>, label: 'Library', path: '/library' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, label: 'History', path: '/history' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, label: 'Your Videos', path: '/my-videos' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, label: 'Watch Later', path: '/watch-later' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.757c1.274 0 1.911 1.54.1.1l-6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/></svg>, label: 'Liked Videos', path: '/liked' },
  ]

  const isActive = (path) => location.pathname === path

  const SidebarItem = ({ item, collapsed }) => (
    <Link
      to={item.path}
      className={`flex flex-col lg:flex-row items-center lg:space-x-5 px-3 py-3 rounded-xl transition-all duration-200 ${
        isActive(item.path)
          ? 'bg-gray-800 text-white font-bold'
          : 'text-gray-300 hover:bg-gray-800'
      }`}
    >
      <div className={`${isActive(item.path) ? 'text-red-500' : 'text-gray-300'}`}>
        {item.icon}
      </div>
      <span className={`text-[10px] lg:text-sm mt-1 lg:mt-0 ${collapsed ? 'hidden' : 'block'}`}>
        {item.label}
      </span>
    </Link>
  )

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[64px] left-0 h-screen lg:h-[calc(100vh-64px)] bg-gray-900 border-r border-gray-800 z-50 transition-all duration-300 overflow-y-auto no-scrollbar ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-[72px]'
        }`}
      >
        {/* Mobile Logo Section */}
        <div className={`flex items-center px-4 h-[64px] lg:hidden border-b border-gray-800 mb-2 ${!isOpen && 'hidden'}`}>
          <button onClick={toggleSidebar} className="p-2.5 hover:bg-gray-800 rounded-full text-white mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="flex items-center space-x-1.5" onClick={toggleSidebar}>
            <div className="w-8 h-6 bg-red-600 rounded-lg flex items-center justify-center">
              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
            </div>
            <span className="text-lg font-bold text-white tracking-tighter">YouTube</span>
          </Link>
        </div>

        <div className="p-2 space-y-1">
          {mainLinks.map((item) => (
            <SidebarItem key={item.path} item={item} collapsed={!isOpen} />
          ))}
        </div>

        <div className={`mt-4 pt-4 border-t border-gray-800 p-2 space-y-1 ${!isOpen && 'hidden'}`}>
          <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">You</h3>
          {libraryLinks.map((item) => (
            <SidebarItem key={item.path} item={item} collapsed={!isOpen} />
          ))}
        </div>

        {isOpen && (
          <div className="mt-4 pt-4 border-t border-gray-800 p-2">
            <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Explore</h3>
            <div className="space-y-1">
              {['Trending', 'Music', 'Movies', 'Gaming', 'News', 'Sports', 'Learning'].map((cat) => (
                <button key={cat} className="flex items-center space-x-5 px-3 py-3 w-full text-left text-sm text-gray-300 hover:bg-gray-800 rounded-xl transition-colors">
                  <span className="text-xl">🔥</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isOpen && (
          <div className="mt-8 px-4 pb-8 space-y-4 text-[12px] font-medium text-gray-500">
            <div className="flex flex-wrap gap-x-2">
              <a href="#" className="hover:text-gray-300">About</a>
              <a href="#" className="hover:text-gray-300">Press</a>
              <a href="#" className="hover:text-gray-300">Copyright</a>
              <a href="#" className="hover:text-gray-300">Contact us</a>
              <a href="#" className="hover:text-gray-300">Creators</a>
              <a href="#" className="hover:text-gray-300">Advertise</a>
              <a href="#" className="hover:text-gray-300">Developers</a>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <a href="#" className="hover:text-gray-300">Terms</a>
              <a href="#" className="hover:text-gray-300">Privacy</a>
              <a href="#" className="hover:text-gray-300">Policy & Safety</a>
              <a href="#" className="hover:text-gray-300">How YouTube works</a>
              <a href="#" className="hover:text-gray-300">Test new features</a>
            </div>
            <p className="font-normal">© 2024 Google LLC</p>
          </div>
        )}
      </aside>
    </>
  )
}

export default YouTubeSidebar
