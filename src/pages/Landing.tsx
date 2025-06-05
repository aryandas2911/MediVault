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
    color: "from-blue-500/10 to-blue-600/10 text-blue-600"
  },
  {
    icon: QrCode,
    title: "Secure QR Sharing with Doctors",
    description: "Share your records instantly with healthcare providers using secure, time-limited QR codes.",
    color: "from-purple-500/10 to-purple-600/10 text-purple-600"
  },
  {
    icon: Shield,
    title: "One Wallet for All Health Documents",
    description: "Keep prescriptions, reports, and medical history organized in your digital health wallet.",
    color: "from-green-500/10 to-green-600/10 text-green-600"
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
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] to-white">
      <Navbar showAuthButtons={true} />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3846035/pexels-photo-3846035.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-sm font-semibold text-primary mb-8 tracking-wider"
            >
              WELCOME TO MEDIVAULT
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-8"
            >
              Your Health Records,
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Secured Forever
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12"
            >
              Experience the future of medical record management. Store, access, and share your health documents securely from anywhere in the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex items-center text-gray-500"
            >
              <ArrowRight className="w-5 h-5 mr-2 animate-bounce" />
              <span>Scroll to explore</span>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute right-0 bottom-0 w-96 h-96 bg-gradient-to-t from-primary/20 to-transparent rounded-full blur-3xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
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
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How MediVault Works
            </h2>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <FadeInWhenVisible key={step.title} delay={index * 0.2}>
                <div className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/20 to-transparent" />
                  )}
                  <div className="card text-center hover:shadow-lg transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
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
      <section className="py-20 bg-gradient-to-b from-[#F0F4FF] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInWhenVisible>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
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
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <img
                src="https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
            <div className="card bg-gradient-to-r from-primary to-secondary text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3846035/pexels-photo-3846035.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10" />
              <div className="relative text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Take Control of Your Medical Records?
                </h2>
                <p className="text-xl opacity-90 mb-8">
                  Join thousands of users who trust MediVault with their health information
                </p>
                <motion.button
                  onClick={() => navigate('/register')}
                  className="bg-white text-primary px-8 py-4 rounded-xl font-medium 
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
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              © 2025 MediVault. All rights reserved.
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
    </div>
  )
}