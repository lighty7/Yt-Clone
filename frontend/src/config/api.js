export const API_URL =
  (import.meta.env.MODE === 'development')
    ? (import.meta.env.VITE_API_URL || 'http://localhost:3000')
    : (import.meta.env.VITE_API_URL || 'https://yt-clone-il3g.onrender.com')

// Debug logging for both dev and prod
console.log('🌍 Environment Mode:', import.meta.env.MODE)
console.log('🔗 API URL:', API_URL)
console.log('📝 VITE_API_URL from env:', import.meta.env.VITE_API_URL)

if (import.meta.env.DEV) {
  console.log('🛠️ Running in DEVELOPMENT mode')
  console.log('💡 Make sure backend is running on', API_URL)
}

if (import.meta.env.PROD) {
  console.log('🚀 Running in PRODUCTION mode')
  if (!import.meta.env.VITE_API_URL) {
    console.warn('⚠️ VITE_API_URL not set in environment, using fallback')
  }
}