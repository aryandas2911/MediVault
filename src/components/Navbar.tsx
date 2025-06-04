import { LogOut, UserCircle, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#F0F4FF] to-white dark:from-[#0D1117] dark:to-[#1E293B] px-4 py-2 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-14 items-center">
          <Link 
            to="/dashboard" 
            className="flex items-center text-2xl font-bold text-primary dark:text-white hover:text-primary/90 dark:hover:text-primary transition-colors"
          >
            MediVault
          </Link>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-full 
                       bg-white/50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 
                       transition-all duration-300 group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-primary dark:text-white" />
              ) : (
                <Sun className="w-5 h-5 text-primary dark:text-white" />
              )}
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <Link
                to="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full 
                         bg-white/50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 
                         transition-all duration-300
                         group-hover:ring-4 group-hover:ring-primary/20"
                title="Profile"
              >
                <UserCircle className="w-6 h-6 text-primary dark:text-white" />
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
                       bg-white/50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 
                       transition-all duration-300
                       hover:ring-4 hover:ring-primary/20 group relative"
              title="Logout"
            >
              <LogOut className="w-6 h-6 text-primary dark:text-white" />
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