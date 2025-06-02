import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { PlusCircle, Files, Share2, HelpCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserProfile } from '../lib/supabase'
import type { User } from '../types/database'

export default function Dashboard() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (session?.user.id) {
      getUserProfile(session.user.id)
        .then(setUser)
        .catch(console.error)
    }
  }, [session])

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
      icon: HelpCircle,
      path: '/about',
      color: 'bg-gray-100 text-gray-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.full_name || 'User'}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your medical records securely in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {navigationCards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left"
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
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}