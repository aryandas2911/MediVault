import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, User, Calendar, Phone, MapPin, Activity, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
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
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session!.user.id)
        .single()

      if (error) throw error
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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user.id) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: session.user.id,
          ...profile
        })

      if (error) throw error
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-2 text-gray-600">
              Update your personal information
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1 relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                        className="input-field pl-10"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <div className="mt-1 relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        value={profile.date_of_birth}
                        onChange={(e) => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1 relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={profile.phone_number}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone_number: e.target.value }))}
                        className="input-field pl-10"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Blood Group
                    </label>
                    <div className="mt-1 relative">
                      <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={profile.blood_group}
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
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1 relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <textarea
                        value={profile.address}
                        onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                        className="input-field pl-10"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  )
}