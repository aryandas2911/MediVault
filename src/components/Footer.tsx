import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img 
              src="/Logo.png" 
              alt="MediVault Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-gray-600">© 2025 MediVault. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <motion.button
              onClick={() => navigate('/about')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              About
            </motion.button>
            <motion.button
              onClick={() => navigate('/privacy')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Privacy Policy
            </motion.button>
            <motion.button
              onClick={() => navigate('/contact')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}