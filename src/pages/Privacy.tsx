import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Lock, Shield, FileText, Users, Key, Mail,
  ChevronRight, AlertTriangle, Eye, Server
} from 'lucide-react'
import Navbar from '../components/Navbar'
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

const sections = [
  {
    icon: FileText,
    title: "Data Collection",
    content: `We collect the following types of information:
    • Personal information (name, email, date of birth)
    • Medical records and documents you upload
    • Usage data to improve our services
    • Device information for security purposes`,
    color: "text-blue-600 bg-blue-100"
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: `Your information is used to:
    • Provide and maintain the MediVault service
    • Store and manage your medical records
    • Enable secure sharing with healthcare providers
    • Improve and personalize your experience
    • Send important service updates`,
    color: "text-purple-600 bg-purple-100"
  },
  {
    icon: Server,
    title: "Data Security",
    content: `We implement robust security measures:
    • End-to-end encryption for all medical records
    • Secure storage using Supabase infrastructure
    • Regular security audits and updates
    • Strict access controls and authentication
    • Automated backup and recovery systems`,
    color: "text-green-600 bg-green-100"
  },
  {
    icon: Users,
    title: "Sharing of Information",
    content: `Your data is shared only:
    • When you explicitly authorize via QR codes
    • With temporary, time-limited access
    • With healthcare providers you choose
    • Never sold to third parties
    • Never used for marketing purposes`,
    color: "text-amber-600 bg-amber-100"
  },
  {
    icon: Key,
    title: "Your Rights",
    content: `You have the right to:
    • Access your personal data
    • Request data correction
    • Delete your account and data
    • Export your information
    • Withdraw sharing consent
    • Report privacy concerns`,
    color: "text-red-600 bg-red-100"
  },
  {
    icon: Mail,
    title: "Contact Information",
    content: `For privacy-related inquiries:
    • Email: privacy@medivault.com
    • Response within 48 hours
    • Address privacy concerns
    • Request data access
    • Report security incidents`,
    color: "text-indigo-600 bg-indigo-100"
  }
]

export default function Privacy() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] to-white">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600">
              How we protect and handle your medical information
            </p>
          </motion.div>

          {/* Last Updated Notice */}
          <FadeInWhenVisible>
            <div className="card bg-gradient-to-r from-amber-50 to-amber-100/50 mb-8">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium">Last Updated: March 15, 2025</p>
                  <p className="text-amber-700 text-sm mt-1">
                    This privacy policy outlines how MediVault collects, uses, and protects your personal and medical information.
                  </p>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Security Promise */}
          <FadeInWhenVisible delay={0.1}>
            <div className="card bg-gradient-to-r from-primary/5 to-secondary/5 mb-12">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Our Promise to You
                  </h2>
                  <p className="text-gray-600">
                    We treat your medical records with the utmost care and implement bank-level security measures to ensure your data remains private and protected.
                  </p>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Main Content */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <FadeInWhenVisible key={section.title} delay={0.2 + index * 0.1}>
                <div className="card hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${section.color}`}>
                      <section.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        {section.title}
                      </h2>
                      <div className="text-gray-600 whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* CTA Footer */}
          <FadeInWhenVisible delay={0.4}>
            <div className="mt-12">
              <div className="card bg-gradient-to-r from-primary/90 to-secondary/90 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
                <div className="relative text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Have questions about your privacy?
                  </h2>
                  <motion.button
                    onClick={() => navigate('/contact')}
                    className="bg-white text-primary px-6 py-3 rounded-xl font-medium 
                             hover:bg-gray-100 transition-colors inline-flex items-center
                             hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Contact Our Privacy Team
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </motion.button>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </main>
      </div>
    </PageTransition>
  )
}