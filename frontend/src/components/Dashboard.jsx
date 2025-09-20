import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Feed from './Feed'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
//     <div className="min-h-screen bg-gray-100">
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">
//   Welcome, {user?.name || user?.email}!
// </h2>
//             <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </nav>
      
//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         <div className="bg-white overflow-hidden shadow rounded-lg">
//           <div className="px-4 py-5 sm:p-6">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">
//               Welcome to your dashboard!
//               <Feed/>
//             </h2>
//             <p className="text-gray-600">
//               You are successfully logged in.
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
    <Feed user={user} handleLogout={handleLogout} />
  )
}

export default Dashboard
