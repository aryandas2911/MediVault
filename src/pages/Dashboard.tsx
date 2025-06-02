import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  PlusCircle, Files, Share2, Info,
  FileText, AlertTriangle, Calendar, Clock,
  ChevronRight
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { getDashboardStats, getRecentActivity } from '../lib/supabase'
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
    icon: PlusCircle,
    path: '/add-record',
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'My Records',
    description: 'View and manage your records',
    icon: Files,
    path: '/records',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Share Records',
    description: 'Share records with healthcare providers',
    icon: Share2,
    path: '/share',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'About MediVault',
    description: 'Learn more about our services',
    icon: Info,
    path: '/about',
    color: 'bg-gray-100 text-gray-600',
  },
]

interface DashboardStats {
  totalRecords: number
  emergencyRecords: number
  upcomingConsultations: number
  lastUpdated: string | null
}

export default function Dashboard() {
  const { userProfile, session } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<MedicalRecord[]>([])
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  useEffect(() => {
    if (session?.user.id) {
      loadDashboardData()
    }
  }, [session])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

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
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Emergency Records',
      value: stats?.emergencyRecords ?? 0,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Upcoming Consultations',
      value: stats?.upcomingConsultations ?? 0,
      icon: Calendar,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Last Updated',
      value: stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Never',
      icon: Clock,
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {userProfile?.full_name || 'User'}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your medical records securely in one place
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="card hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={`p-3 rounded-lg ${stat.color} inline-block`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {navigationCards.map((card, index) => (
            <motion.button
              key={card.path}
              onClick={() => navigate(card.path)}
              className="card hover:shadow-lg transition-all duration-300 text-left"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {card.description}
                  </p>
                </div>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((record) => (
                  <motion.div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
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
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Health Tips
              </h2>
              <motion.div
                key={currentTipIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-4 rounded-xl ${healthTips[currentTipIndex].color}`}
              >
                <h3 className="font-medium text-gray-900 mb-2">
                  {healthTips[currentTipIndex].title}
                </h3>
                <p className="text-sm text-gray-600">
                  {healthTips[currentTipIndex].description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <div className="card bg-gradient-to-r from-primary to-secondary text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Your health data, always with you.
              </h2>
              <motion.button
                onClick={() => navigate('/add-record')}
                className="bg-white text-primary px-6 py-3 rounded-xl font-medium 
                         hover:bg-gray-100 transition-colors inline-flex items-center"
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
    </div>
  )
}