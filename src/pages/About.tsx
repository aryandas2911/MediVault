import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { 
  FileText, QrCode, CloudCog as CloudCheck, Shield, 
  Share2, Clock, ChevronRight, Heart, Lock, Users,
  Zap, CheckCircle
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

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

const stats = [
  {
    value: '10k+',
    label: 'Active Users',
    icon: Users,
    color: 'from-blue-500/10 to-blue-600/10 text-blue-600'
  },
  {
    value: '99.9%',
    label: 'Uptime',
    icon: Zap,
    color: 'from-green-500/10 to-green-600/10 text-green-600'
  },
  {
    value: '256-bit',
    label: 'Encryption',
    icon: Lock,
    color: 'from-purple-500/10 to-purple-600/10 text-purple-600'
  },
  {
    value: '24/7',
    label: 'Support',
    icon: Heart,
    color: 'from-red-500/10 to-red-600/10 text-red-600'
  }
]

const features = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your medical data is protected with state-of-the-art encryption and security measures.',
    color: 'from-blue-500/10 to-blue-600/10 text-blue-600'
  },
  {
    icon: QrCode,
    title: 'Instant QR Sharing',
    description: 'Share specific records with healthcare providers using secure, time-limited QR codes.',
    color: 'from-purple-500/10 to-purple-600/10 text-purple-600'
  },
  {
    icon: CloudCheck,
    title: 'Cloud Storage',
    description: 'Access your records from any device, anytime. Never worry about losing important documents.',
    color: 'from-green-500/10 to-green-600/10 text-green-600'
  }
]

const timeline = [
  {
    year: '2025',
    title: 'MediVault Launch',
    description: 'Revolutionizing medical record management with secure digital storage.'
  },
  {
    year: '2026',
    title: 'Mobile App Release',
    description: 'Bringing medical records to your pocket with our iOS and Android apps.'
  },
  {
    year: '2027',
    title: 'Global Expansion',
    description: 'Now serving healthcare providers and patients worldwide.'
  }
]

export default function About() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] to-white">
        <Navbar />
        
        <main>
          {/* Hero Section */}
          <section className="relative py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-block"
                >
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    About MediVault
                  </span>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-6 text-4xl md:text-5xl font-bold text-gray-900"
                >
                  Transforming Healthcare
                  <span className="block text-primary">One Record at a Time</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-6 text-xl text-gray-600"
                >
                  MediVault is revolutionizing how people manage and share their medical records,
                  making healthcare more accessible and efficient for everyone.
                </motion.p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <FadeInWhenVisible key={stat.label} delay={index * 0.1}>
                    <motion.div
                      className={`card bg-gradient-to-br ${stat.color}`}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 rounded-xl bg-white/50 mb-4">
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm opacity-80">{stat.label}</div>
                      </div>
                    </motion.div>
                  </FadeInWhenVisible>
                ))}
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <FadeInWhenVisible>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Our Mission
                    </h2>
                    <p className="text-gray-600 mb-8">
                      At MediVault, we believe everyone should have secure, instant access to their complete medical history. 
                      Our platform empowers individuals to take control of their health records while ensuring the highest 
                      level of security and privacy.
                    </p>
                    <div className="space-y-4">
                      {[
                        'Empowering patients with their medical data',
                        'Enhancing healthcare provider collaboration',
                        'Ensuring data security and privacy',
                        'Making healthcare more accessible'
                      ].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.2}>
                  <div className="relative">
                    <img
                      src="https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg"
                      alt="Medical Professional"
                      className="rounded-2xl shadow-2xl w-full"
                    />
                    <div className="absolute -z-10 -right-6 -bottom-6 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl" />
                  </div>
                </FadeInWhenVisible>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-gradient-to-b from-[#F0F4FF] to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">
                  Core Features
                </h2>
                <p className="mt-4 text-xl text-gray-600">
                  Everything you need to manage your medical records securely
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <FadeInWhenVisible key={feature.title} delay={index * 0.2}>
                    <motion.div
                      className={`card bg-gradient-to-br ${feature.color}`}
                      whileHover={{ y: -5 }}
                    >
                      <div className="p-3 rounded-xl bg-white/50 inline-block mb-4">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
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

          {/* Timeline Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Journey
                </h2>
              </div>

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <FadeInWhenVisible key={item.year} delay={index * 0.2}>
                    <div className="card hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold">
                          {item.year}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </FadeInWhenVisible>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeInWhenVisible>
                <div className="card bg-gradient-to-r from-primary to-secondary text-white overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg')] bg-cover bg-center opacity-10" />
                  <div className="relative text-center">
                    <h2 className="text-3xl font-bold mb-4">
                      Ready to Get Started?
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
                      Create Your Account
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </motion.button>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  )
}