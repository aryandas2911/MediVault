import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FileText, QrCode, CloudCog as CloudCheck, Shield, Share2, Clock, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

const features = [
  {
    icon: FileText,
    title: 'All-in-One Record Wallet',
    description: 'Upload and manage reports, prescriptions, allergies, and more in one secure place.',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: QrCode,
    title: 'Quick Share via QR',
    description: 'Share medical records instantly with healthcare providers using secure QR codes.',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    icon: CloudCheck,
    title: 'Always Accessible',
    description: 'Access your medical history anytime, anywhere, from any device securely.',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your health data is encrypted and protected with the highest security standards.',
    color: 'text-red-600 bg-red-100'
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share specific records with doctors or family members with granular control.',
    color: 'text-amber-600 bg-amber-100'
  },
  {
    icon: Clock,
    title: 'Time-Limited Access',
    description: 'Set expiration times for shared records to maintain privacy and control.',
    color: 'text-indigo-600 bg-indigo-100'
  }
]

function FadeInWhenVisible({ children }: { children: React.ReactNode }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white">
        <Navbar />
        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                    Secure Your Health Records with MediVault
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    One wallet for all your medical records. Accessible. Searchable. Shareable.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      onClick={() => navigate('/records')}
                      className="btn-primary flex items-center justify-center group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Your Records
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    <motion.button
                      onClick={() => navigate('/share')}
                      className="btn-secondary flex items-center justify-center group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Share with Doctor
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
                    src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80"
                    alt="Doctor using digital tablet"
                    className="rounded-2xl shadow-2xl w-full"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <FadeInWhenVisible>
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                  Why Choose MediVault?
                </h2>
              </FadeInWhenVisible>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <FadeInWhenVisible key={feature.title}>
                    <motion.div
                      className="card hover:shadow-lg transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className={`p-3 rounded-xl inline-block ${feature.color} mb-4`}>
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

          {/* Bottom CTA */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible>
              <div className="max-w-4xl mx-auto text-center">
                <div className="card bg-gradient-to-r from-primary/90 to-secondary/90 text-white overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
                  <div className="relative text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Ready to explore MediVault?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                      Discover how MediVault can transform your healthcare journey
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.button
                        onClick={() => navigate('/profile')}
                        className="bg-white text-primary px-6 py-3 rounded-xl font-medium 
                               hover:bg-gray-100 transition-colors inline-flex items-center
                               hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Complete Your Profile
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </motion.button>
                      <motion.button
                        onClick={() => navigate('/records')}
                        className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-medium 
                               hover:bg-white/20 transition-colors inline-flex items-center
                               hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Browse Records
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  )
}