import { LogOut, UserCircle, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar({ showAuthButtons = true }: { showAuthButtons?: boolean }) {
  const { signOut, session } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const isPublicPage = ['/about', '/privacy', '/contact'].includes(location.pathname)

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#F0F4FF] to-white dark:from-[#0D1117] dark:to-[#1E293B] px-4 py-2 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-14 items-center">
          <Link 
            to={session ? '/dashboard' : '/'} 
            className="flex items-center text-2xl font-bold text-primary dark:text-white hover:text-primary/90 dark:hover:text-primary transition-colors"
          >
            MediVault
          </Link>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 
                              dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 
                              peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
                              after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                              after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 
                              peer-checked:bg-primary relative overflow-hidden">
                  <Sun className="absolute left-1 top-1 h-5 w-5 text-yellow-500 transition-opacity opacity-100 dark:opacity-0" />
                  <Moon className="absolute right-1 top-1 h-5 w-5 text-slate-200 transition-opacity opacity-0 dark:opacity-100" />
                </div>
              </label>
            </div>

            {/* Public Page Navigation */}
            {isPublicPage && !session && (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/about"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors
                            ${location.pathname === '/about' ? 'text-primary dark:text-primary' : ''}`}
                >
                  About
                </Link>
                <Link 
                  to="/privacy"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors
                            ${location.pathname === '/privacy' ? 'text-primary dark:text-primary' : ''}`}
                >
                  Privacy
                </Link>
                <Link 
                  to="/contact"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors
                            ${location.pathname === '/contact' ? 'text-primary dark:text-primary' : ''}`}
                >
                  Contact
                </Link>
              </div>
            )}

            {/* Auth Buttons */}
            {showAuthButtons && !session && !isPublicPage && (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-primary dark:text-white hover:text-primary/90 dark:hover:text-primary/90 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-primary transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* User Menu */}
            {session && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}