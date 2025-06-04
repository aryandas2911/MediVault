import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { 
  Shield, QrCode, FileText, ChevronRight, 
  Upload, Share2, Clock, CheckCircle, ArrowRight
} from 'lucide-react'
import Navbar from '../components/Navbar'

function FadeInWhenVisible({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

const features = [
  {
    icon: FileText,
    title: "Upload and View Medical Records",
    description: "Store all your medical documents securely in one place. Access them anytime, anywhere.",
    color: "from-blue-500/10 to-blue-600/10 text-blue-600 dark:from-blue-500/20 dark:to-blue-600/20 dark:text-blue-400"
  },
  {
    icon: QrCode,
    title: "Secure QR Sharing with Doctors",
    description: "Share your records instantly with healthcare providers using secure, time-limited QR codes.",
    color: "from-purple-500/10 to-purple-600/10 text-purple-600 dark:from-purple-500/20 dark:to-purple-600/20 dark:text-purple-400"
  },
  {
    icon: Shield,
    title: "One Wallet for All Health Documents",
    description: "Keep prescriptions, reports, and medical history organized in your digital health wallet.",
    color: "from-green-500/10 to-green-600/10 text-green-600 dark:from-green-500/20 dark:to-green-600/20 dark:text-green-400"
  }
]

const steps = [
  {
    icon: Upload,
    title: "Upload Your Records",
    description: "Easily upload and organize your medical documents"
  },
  {
    icon: Shield,
    title: "Secure Storage",
    description: "Your records are encrypted and stored safely"
  },
  {
    icon: Share2,
    title: "Share When Needed",
    description: "Instantly share records with healthcare providers"
  }
]

const benefits = [
  "Bank-level security for your medical data",
  "Access your records 24/7 from any device",
  "Share records securely with QR codes",
  "Organize all health documents in one place",
  "Track your medical history efficiently"
]

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] to-white dark:from-[#0D1117] dark:to-[#1E293B] transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Secure, Unified Medical Records — Anytime, Anywhere
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                MediVault lets you store, manage, and share your medical records safely in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={() => navigate('/register')}
                  className="btn-primary flex items-center justify-center group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => navigate('/about')}
                  className="btn-secondary flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                  <ChevronRight className="w-5 h-5 ml-2" />
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
                alt="Digital Health Records"
                className="rounded-2xl shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F0F4FF] dark:from-[#0D1117] dark:to-[#1E293B] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Everything You Need to Manage Your Health Records
            </h2>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FadeInWhenVisible key={feature.title} delay={index * 0.2}>
                <motion.div
                  className="card hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className={`p-4 rounded-xl inline-block bg-gradient-to-br ${feature.color} mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              How MediVault Works
            </h2>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <FadeInWhenVisible key={step.title} delay={index * 0.2}>
                <div className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/20 to-transparent dark:from-primary/40" />
                  )}
                  <div className="card text-center hover:shadow-lg transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark flex items-center justify-center mx-auto mb-6">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Why MediVault */}
      <section className="py-20 bg-gradient-to-b from-[#F0F4FF] to-white dark:from-[#0D1117] dark:to-[#1E293B] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInWhenVisible>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Why Choose MediVault?
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-primary dark:text-primary-dark flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
                alt="Medical Professional using MediVault"
                className="rounded-2xl shadow-2xl w-full"
              />
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="card bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
              <div className="relative text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Take Control of Your Medical Records?
                </h2>
                <p className="text-xl opacity-90 mb-8">
                  Join thousands of users who trust MediVault with their health information
                </p>
                <motion.button
                  onClick={() => navigate('/register')}
                  className="bg-white text-primary dark:text-primary-dark px-8 py-4 rounded-xl font-medium 
                           hover:bg-gray-100 transition-colors inline-flex items-center
                           hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              © 2025 MediVault. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <motion.button
                onClick={() => navigate('/about')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                About
              </motion.button>
              <motion.button
                onClick={() => navigate('/privacy')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Privacy Policy
              </motion.button>
              <motion.button
                onClick={() => navigate('/contact')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}