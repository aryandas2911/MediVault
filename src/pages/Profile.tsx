import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, User, Calendar, Phone, MapPin, Activity, ChevronRight, Mail, Shield, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { useAuth } from '../context/AuthContext'
import { getExtendedProfile, updateExtendedProfile } from '../lib/supabase'
import type { UserProfile } from '../types/database'
import Footer from '../components/Footer'

function UserAvatar({ name, size = 'large' }: { name: string, size?: 'large' | 'small' }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      className={`rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold
                ${size === 'large' ? 'w-24 h-24 text-3xl' : 'w-12 h-12 text-lg'}`}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      {initials}
    </motion.div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full" />
        <div className="h-8 bg-gray-200 rounded w-48" />
      </div>
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    full_name: '',
    date_of_birth: '',
    gender: '',
    phone_number: '',
    blood_group: '',
    address: ''
  })

  useEffect(() => {
    if (session?.user.id) {
      loadProfile()
    }
  }, [session])

  const loadProfile = async () => {
    try {
      const data = await getExtendedProfile(session!.user.id)
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          phone_number: data.phone_number || '',
          blood_group: data.blood_group || '',
          address: data.address || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user.id) return

    setSaving(true)
    try {
      // Convert empty strings to null for nullable fields
      const sanitizedProfile = {
        ...profile,
        date_of_birth: profile.date_of_birth === '' ? null : profile.date_of_birth,
        gender: profile.gender === '' ? null : profile.gender,
        phone_number: profile.phone_number === '' ? null : profile.phone_number,
        blood_group: profile.blood_group === '' ? null : profile.blood_group,
        address: profile.address === '' ? null : profile.address
      }

      await updateExtendedProfile(session.user.id, sanitizedProfile)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Profile Overview Card */}
              <div className="card bg-gradient-to-br from-white to-gray-50">
                <div className="flex flex-col items-center text-center">
                  <UserAvatar name={profile.full_name || 'User'} />
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    {profile.full_name || 'Welcome!'}
                  </h2>
                  <p className="text-gray-600">
                    {session?.user.email}
                  </p>
                </div>
              </div>

              {/* Account Security */}
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100/50">
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 text-primary mr-2" />
                  <h3 className="font-semibold text-gray-900">
                    Account Security
                  </h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Email Verified</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Last Updated</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="card bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 text-primary mr-2" />
                  <h3 className="font-semibold text-gray-900">
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-2">
                  <motion.button
                    onClick={() => navigate('/records')}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-white transition-colors flex items-center justify-between"
                    whileHover={{ x: 5 }}
                  >
                    View Medical Records
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/share')}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-white transition-colors flex items-center justify-between"
                    whileHover={{ x: 5 }}
                  >
                    Share Records
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Personal Information
                </h2>

                {loading ? (
                  <ProfileSkeleton />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            required
                            value={profile.full_name || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                            className="input-field pl-10"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={session?.user.email || ''}
                            disabled
                            className="input-field pl-10 bg-gray-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="date"
                            value={profile.date_of_birth || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                            className="input-field pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          value={profile.gender || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                          className="input-field"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={profile.phone_number || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, phone_number: e.target.value }))}
                            className="input-field pl-10"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Blood Group
                        </label>
                        <div className="relative">
                          <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <select
                            value={profile.blood_group || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, blood_group: e.target.value }))}
                            className="input-field pl-10"
                          >
                            <option value="">Select blood group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <textarea
                            value={profile.address || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                            rows={3}
                            className="input-field pl-10"
                            placeholder="Enter your address"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.button
                        type="submit"
                        disabled={saving}
                        className="btn-primary flex-1 flex items-center justify-center relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <AnimatePresence mode="wait">
                          {saving ? (
                            <motion.div
                              key="saving"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 flex items-center justify-center bg-inherit"
                            >
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="save"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center"
                            >
                              <Save className="w-5 h-5 mr-2" />
                              Save Changes
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="btn-secondary flex-1 flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Back to Dashboard
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  )
}