import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  AlertTriangle, FileText, Share2, Info,
  Clock, ChevronRight, PlusCircle, Files,
  Plus, ArrowRight
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import MapCard from '../components/MapCard'
import { useAuth } from '../context/AuthContext'
import { getDashboardStats, getRecentActivity, getExtendedProfile } from '../lib/supabase'
import type { MedicalRecord } from '../types/database'

const healthTips = [
  {
    title: "Regular Health Check-ups",
    description: "Schedule your annual health check-up to stay on top of your wellness journey.",
    color: "bg-blue-50"
  },
  {
    title: "Update Your Records",
    description: "Keep your medical records up to date for better healthcare decisions.",
    color: "bg-green-50"
  }
]

const navigationCards = [
  {
    title: 'Add Record',
    description: 'Create a new medical record',
    icon: Plus,
    path: '/add-record',
    color: 'from-green-500/10 to-green-600/10 text-green-600',
  },
  {
    title: 'My Records',
    description: 'View and manage your records',
    icon: Files,
    path: '/records',
    color: 'from-blue-500/10 to-blue-600/10 text-blue-600',
  },
  {
    title: 'Share Records',
    description: 'Share records with healthcare providers',
    icon: Share2,
    path: '/share',
    color: 'from-purple-500/10 to-purple-600/10 text-purple-600',
  },
  {
    title: 'About MediVault',
    description: 'Learn more about our services',
    icon: Info,
    path: '/about',
    color: 'from-gray-500/10 to-gray-600/10 text-gray-600',
  },
]

interface DashboardStats {
  totalRecords: number
  emergencyRecords: number
  upcomingConsultations: number
  lastUpdated: string | null
}

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
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

export default function Dashboard() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<MedicalRecord[]>([])
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [userName, setUserName] = useState<string>('User')

  useEffect(() => {
    if (session?.user.id) {
      loadDashboardData()
      loadUserProfile()
    }
  }, [session])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const loadUserProfile = async () => {
    try {
      const profile = await getExtendedProfile(session!.user.id)
      if (profile?.full_name) {
        setUserName(profile.full_name)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const loadDashboardData = async () => {
    try {
      const [dashboardStats, activity] = await Promise.all([
        getDashboardStats(session!.user.id),
        getRecentActivity(session!.user.id)
      ])
      setStats(dashboardStats)
      setRecentActivity(activity)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const statCards = [
    {
      title: 'Total Records',
      value: stats?.totalRecords ?? 0,
      icon: FileText,
      color: 'from-blue-500/10 to-blue-600/10 text-blue-600'
    },
    {
      title: 'Emergency Records',
      value: stats?.emergencyRecords ?? 0,
      icon: AlertTriangle,
      color: 'from-red-500/10 to-red-600/10 text-red-600'
    },
    {
      title: 'Upcoming Consultations',
      value: stats?.upcomingConsultations ?? 0,
      icon: Clock,
      color: 'from-green-500/10 to-green-600/10 text-green-600'
    },
    {
      title: 'Last Updated',
      value: stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Never',
      icon: Clock,
      color: 'from-purple-500/10 to-purple-600/10 text-purple-600'
    }
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] to-white">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-12"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 rounded-3xl" />
            <div className="relative p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-white/20">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Welcome, {userName}! 👋
              </h1>
              <p className="text-xl text-gray-600">
                Manage your medical records securely in one place
              </p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                className={`card hover:shadow-lg transition-all duration-300 overflow-hidden relative bg-gradient-to-br ${stat.color}`}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <stat.icon className="w-16 h-16" />
                </div>
                <div className="relative">
                  <h3 className="text-lg font-semibold">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {navigationCards.map((card, index) => (
              <motion.button
                key={card.path}
                onClick={() => navigate(card.path)}
                className={`card hover:shadow-lg transition-all duration-300 text-left bg-gradient-to-br ${card.color}`}
                whileHover={{ y: -5, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="p-3 rounded-xl bg-white/50 inline-block mb-4">
                      <card.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      {card.title}
                    </h3>
                    <p className="text-sm mt-1 opacity-80">
                      {card.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((record) => (
                    <motion.div
                      key={record.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {record.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(record.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`badge ${
                        record.type === 'prescription' ? 'badge-blue' :
                        record.type === 'allergy' ? 'badge-red' :
                        record.type === 'condition' ? 'badge-purple' :
                        'badge-green'
                      }`}>
                        {record.type}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Health Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="card bg-gradient-to-br from-blue-50 to-purple-50">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Health Tips
                </h2>
                <motion.div
                  key={currentTipIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-6 rounded-xl ${healthTips[currentTipIndex].color}`}
                >
                  <h3 className="font-medium text-gray-900 mb-2">
                    {healthTips[currentTipIndex].title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {healthTips[currentTipIndex].description}
                  </p>
                </motion.div>
              </div>

              {/* Map Card */}
              <div className="mt-6">
                <MapCard />
              </div>
            </motion.div>
          </div>

          {/* CTA Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12"
          >
            <div className="card bg-gradient-to-r from-primary/90 to-secondary/90 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
              <div className="relative text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Your health data, always with you
                </h2>
                <motion.button
                  onClick={() => navigate('/add-record')}
                  className="bg-white text-primary px-6 py-3 rounded-xl font-medium 
                           hover:bg-gray-100 transition-colors inline-flex items-center
                           hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Managing Now
                  <ChevronRight className="w-5 h-5 ml-2" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  )
}