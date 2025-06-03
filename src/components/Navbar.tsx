import { LogOut, UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { signOut } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#F0F4FF] to-white px-4 py-2 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-14 items-center">
          <Link 
            to="/dashboard" 
            className="flex items-center text-2xl font-bold text-primary hover:text-primary/90 transition-colors"
          >
            MediVault
          </Link>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <Link
                to="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full 
                         bg-white/50 hover:bg-white transition-all duration-300
                         group-hover:ring-4 group-hover:ring-primary/20"
                title="Profile"
              >
                <UserCircle className="w-6 h-6 text-primary" />
              </Link>
              <div className="absolute top-full mt-2 right-0 w-auto whitespace-nowrap
                            bg-gray-800 text-white text-sm py-1 px-2 rounded
                            opacity-0 group-hover:opacity-100 transition-opacity
                            pointer-events-none">
                Profile
              </div>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={signOut}
              className="flex items-center justify-center w-10 h-10 rounded-full 
                       bg-white/50 hover:bg-white transition-all duration-300
                       hover:ring-4 hover:ring-primary/20 group relative"
              title="Logout"
            >
              <LogOut className="w-6 h-6 text-primary" />
              <div className="absolute top-full mt-2 right-0 w-auto whitespace-nowrap
                            bg-gray-800 text-white text-sm py-1 px-2 rounded
                            opacity-0 group-hover:opacity-100 transition-opacity
                            pointer-events-none">
                Logout
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}