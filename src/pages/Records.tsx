import { useState, useEffect } from 'react'
import { supabase } from '..lib/supabase.ts'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, FileText, Pencil, Search, Filter, Calendar, ChevronRight, PlusCircle, Trash2, ChevronDown, Building2 as Hospital, User, Clock, X, Download, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getMedicalRecords, deleteMedicalRecord, deleteFile, getSignedFileUrl } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { MedicalRecord, MedicalRecordType } from '../types/database'

export default function Records() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<MedicalRecordType | ''>('')
  const [selectedDate, setSelectedDate] = useState('')
  const [emergencyOnly, setEmergencyOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

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

  const handleDelete = async (record: MedicalRecord) => {
  try {
    // 1. Delete the record from the Supabase table
    const { error: dbError } = await supabase
      .from('medical_records') // make sure this is your exact table name
      .delete()
      .eq('id', record.id)

    if (dbError) {
      console.error('Database delete error:', dbError)
      toast.error('Failed to delete record from database')
      return
    }

    // 2. Delete the file from Supabase Storage if it exists
    if (record.file_url) {
      const { error: storageError } = await supabase
        .storage
        .from('medical_files') // replace with your actual bucket name
        .remove([record.file_url])

      if (storageError) {
        console.error('Storage delete error:', storageError)
        toast.error('Record deleted, but failed to delete attached file')
      }
    }

    // 3. Update UI state
    setRecords(prev => prev.filter(r => r.id !== record.id))
    toast.success('Record deleted successfully')
  } catch (error) {
    toast.error('Unexpected error while deleting')
    console.error(error)
  } finally {
    setDeleteConfirm(null)
  }
}


  const handleFileAction = async (record: MedicalRecord, action: 'view' | 'download') => {
    if (!record.file_url) return
    
    try {
      const signedUrl = await getSignedFileUrl(record.file_url)
      
      if (action === 'view') {
        window.open(signedUrl, '_blank')
      } else {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a')
        const response = await fetch(signedUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        link.href = url
        link.download = `${record.title}${getFileExtension(record.file_url)}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      toast.error('Failed to access file')
      console.error(error)
    }
  }

  const getFileExtension = (url: string): string => {
    const extension = url.split('.').pop()
    return extension ? `.${extension}` : ''
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

  const getTypeColor = (type: string) => {
    const colors = {
      prescription: 'bg-blue-100 text-blue-800',
      allergy: 'bg-red-100 text-red-800',
      condition: 'bg-purple-100 text-purple-800',
      report: 'bg-green-100 text-green-800'
    }
    return colors[type as keyof typeof colors]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] to-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
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
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100/50">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-blue-600 font-medium">Total Records</p>
                <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-red-50 to-red-100/50">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-red-600 font-medium">Emergency Records</p>
                <p className="text-2xl font-bold text-red-800">{stats.emergency}</p>
              </div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100/50">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-purple-600 font-medium">Last Added</p>
                <p className="text-2xl font-bold text-purple-800">{stats.lastAdded}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="sticky top-20 z-10 bg-white shadow-md rounded-xl p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search records..."
                className="input-field pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center px-4 py-2 rounded-lg
                         border border-gray-200 hover:border-primary/60 transition-colors
                         ${showFilters ? 'bg-primary/5 border-primary/60' : 'bg-white'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-5 h-5 mr-2 text-gray-600" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </motion.button>

              {(searchQuery || selectedType || selectedDate || emergencyOnly) && (
                <motion.button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedType('')
                    setSelectedDate('')
                    setEmergencyOnly(false)
                  }}
                  className="flex items-center justify-center px-4 py-2 rounded-lg
                           border border-gray-200 hover:border-red-400 hover:bg-red-50
                           transition-colors text-red-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Type Filter */}
                  <div>
                    <select
                      className="input-field w-full"
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
                  <div>
                    <input
                      type="date"
                      className="input-field w-full"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  {/* Emergency Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emergencyOnly"
                      className="h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
                      checked={emergencyOnly}
                      onChange={(e) => setEmergencyOnly(e.target.checked)}
                    />
                    <label htmlFor="emergencyOnly" className="ml-2 text-sm text-gray-700">
                      Emergency Records Only
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRecords.map((record) => (
                <motion.div
                  key={record.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card hover:shadow-lg transition-all duration-300"
                >
                  <motion.div
                    className="cursor-pointer"
                    onClick={() => setExpandedRecord(
                      expandedRecord === record.id ? null : record.id
                    )}
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

                    <AnimatePresence>
                      {expandedRecord === record.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4 mt-4 pb-4"
                        >
                          {record.description && (
                            <p className="text-gray-600">{record.description}</p>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            {record.hospital_name && (
                              <div className="flex items-center text-gray-600">
                                <Hospital className="w-4 h-4 mr-2" />
                                {record.hospital_name}
                              </div>
                            )}
                            
                            {record.doctor_name && (
                              <div className="flex items-center text-gray-600">
                                <User className="w-4 h-4 mr-2" />
                                {record.doctor_name}
                              </div>
                            )}
                          </div>

                          {record.consultation_date && (
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(record.consultation_date).toLocaleDateString()}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      {record.file_url && (
                        <div className="flex space-x-4">
                          <motion.button
                            onClick={() => handleFileAction(record, 'view')}
                            className="flex items-center text-primary hover:text-primary/90"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </motion.button>
                          <motion.button
                            onClick={() => handleFileAction(record, 'download')}
                            className="flex items-center text-primary hover:text-primary/90"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </motion.button>
                        </div>
                      )}
                      <motion.button
                        onClick={() => navigate(`/edit-record/${record.id}`)}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </motion.button>
                    </div>
                    
                    {deleteConfirm === record.id ? (
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => handleDelete(record)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Confirm
                        </motion.button>
                        <motion.button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        onClick={() => setDeleteConfirm(record.id)}
                        className="flex items-center text-red-600 hover:text-red-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
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
          <div className="card bg-gradient-to-r from-primary/90 to-secondary/90 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
            <div className="relative text-center">
              <h2 className="text-2xl font-bold mb-4">
                Keep your medical history organized
              </h2>
              <motion.button
                onClick={() => navigate('/add-record')}
                className="bg-white text-primary px-6 py-3 rounded-xl font-medium 
                         hover:bg-gray-100 transition-colors inline-flex items-center
                         hover:shadow-lg"
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
      <Footer />
    </div>
  )
}