import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  AlertTriangle, FileText, Pencil, Search,
  Filter, Calendar, ChevronRight, PlusCircle
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { getMedicalRecords } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { MedicalRecord, MedicalRecordType } from '../types/database'

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

export default function Records() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<MedicalRecordType | ''>('')
  const [selectedDate, setSelectedDate] = useState('')
  const [emergencyOnly, setEmergencyOnly] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    emergency: 0,
    lastAdded: ''
  })

  useEffect(() => {
    if (session?.user.id) {
      loadRecords()
    }
  }, [session])

  const loadRecords = async () => {
    try {
      const data = await getMedicalRecords(session!.user.id)
      setRecords(data)
      
      // Calculate stats
      setStats({
        total: data.length,
        emergency: data.filter(r => r.is_emergency).length,
        lastAdded: data.length > 0 
          ? new Date(Math.max(...data.map(r => new Date(r.created_at).getTime()))).toLocaleDateString()
          : 'Never'
      })
    } catch (error) {
      setError('Failed to load medical records')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter(record => {
    const matchesSearch = searchQuery === '' || 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === '' || record.type === selectedType
    
    const matchesDate = selectedDate === '' || 
      record.consultation_date === selectedDate

    const matchesEmergency = !emergencyOnly || record.is_emergency

    return matchesSearch && matchesType && matchesDate && matchesEmergency
  })

  const getTypeColor = (type: MedicalRecordType) => {
    const colors = {
      prescription: 'bg-blue-100 text-blue-800',
      allergy: 'bg-red-100 text-red-800',
      condition: 'bg-purple-100 text-purple-800',
      report: 'bg-green-100 text-green-800'
    }
    return colors[type]
  }

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
              <p className="mt-2 text-gray-600">
                View and manage your medical history
              </p>
            </div>
            <motion.button
              onClick={() => navigate('/add-record')}
              className="mt-4 md:mt-0 btn-primary flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add New Record
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="card bg-blue-50">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-blue-600 font-medium">Total Records</p>
                <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="card bg-red-50">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-red-600 font-medium">Emergency Records</p>
                <p className="text-2xl font-bold text-red-800">{stats.emergency}</p>
              </div>
            </div>
          </div>
          <div className="card bg-purple-50">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-purple-600 font-medium">Last Added</p>
                <p className="text-2xl font-bold text-purple-800">{stats.lastAdded}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters - Sticky Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="sticky top-0 z-10 bg-white shadow-md rounded-xl p-4 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search records..."
                className="input-field pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="input-field pl-10"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as MedicalRecordType | '')}
              >
                <option value="">All Types</option>
                <option value="prescription">Prescription</option>
                <option value="allergy">Allergy</option>
                <option value="condition">Condition</option>
                <option value="report">Report</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                className="input-field pl-10"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Emergency Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emergencyOnly"
                className="h-4 w-4 text-secondary rounded border-gray-300 focus:ring-secondary"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
              />
              <label htmlFor="emergencyOnly" className="ml-2 text-sm text-gray-700">
                Emergency Records Only
              </label>
            </div>
          </div>
        </motion.div>

        {/* Records Grid */}
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : filteredRecords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No records found
            </h3>
            <p className="text-gray-600 mb-6">
              {records.length === 0 
                ? "You haven't uploaded any records yet."
                : "No records match your search criteria."}
            </p>
            <motion.button
              onClick={() => navigate('/add-record')}
              className="btn-primary inline-flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Your First Record
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecords.map((record, index) => (
                <FadeInWhenVisible key={record.id}>
                  <motion.div 
                    className="card hover:shadow-lg transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {record.title}
                        </h3>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getTypeColor(record.type)}`}>
                          {record.type}
                        </span>
                      </div>
                      {record.is_emergency && (
                        <div className="bg-red-100 p-2 rounded-lg">
                          <AlertTriangle className="text-red-500 w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                      {record.description && (
                        <p className="line-clamp-2">{record.description}</p>
                      )}
                      {record.hospital_name && (
                        <p>Hospital: {record.hospital_name}</p>
                      )}
                      {record.doctor_name && (
                        <p>Doctor: {record.doctor_name}</p>
                      )}
                      {record.consultation_date && (
                        <p>Date: {new Date(record.consultation_date).toLocaleDateString()}</p>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      {record.file_url && (
                        <motion.a
                          href={record.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:text-primary/90"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View File
                        </motion.a>
                      )}
                      <motion.button
                        onClick={() => navigate(`/edit-record/${record.id}`)}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </motion.button>
                    </div>
                  </motion.div>
                </FadeInWhenVisible>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <div className="card bg-gradient-to-r from-primary to-secondary text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Securely manage, search, and update your health data
              </h2>
              <motion.button
                onClick={() => navigate('/add-record')}
                className="bg-white text-primary px-6 py-3 rounded-xl font-medium 
                         hover:bg-gray-100 transition-colors inline-flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add New Record
                <ChevronRight className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}