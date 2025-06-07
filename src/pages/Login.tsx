import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    try {
      await signIn(email, password)
      // Navigate to dashboard after successful sign in
      navigate('/dashboard')
    } catch (error) {
      setError('Invalid login credentials')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Image Panel */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:block relative"
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3846035/pexels-photo-3846035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-xl text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl font-bold mb-6"
            >
              Welcome to MediVault
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-lg opacity-90"
            >
              Your secure digital vault for managing and accessing medical records anytime, anywhere.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Form Panel */}
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-[#F0F4FF] to-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo - Only visible on mobile */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 lg:hidden"
          >
            <h1 className="text-3xl font-bold text-gray-900">MediVault</h1>
            <p className="mt-2 text-gray-600">Welcome back!</p>
          </motion.div>

          <div className="card backdrop-blur-sm bg-white/80">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-600 mb-8">
              Enter your credentials to access your records
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-lg bg-red-50 text-red-600 flex items-center text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-inherit"
                    >
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign in
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:text-primary/90 font-medium">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
