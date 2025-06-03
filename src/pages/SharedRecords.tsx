import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, FileText, Download, Clock,
  Hospital, User, Calendar, Shield, Info
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { MedicalRecord } from '../types/database'

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white flex items-center justify-center">
      <motion.div
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Access Error
        </h2>
        <p className="text-gray-600">{message}</p>
      </motion.div>
    </div>
  )
}

export default function SharedRecords() {
  const { id } = useParams<{ id: string }>()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadRecords()
    }
  }, [id])

  const loadRecords = async () => {
    try {
      const recordIds = id?.split(',') || []
      const { data, error: fetchError } = await supabase
        .from('medical_records')
        .select('*')
        .in('id', recordIds)
      
      if (fetchError) throw fetchError
      setRecords(data || [])
    } catch (error) {
      setError('Failed to load shared records')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      prescription: 'bg-blue-100 text-blue-800',
      allergy: 'bg-red-100 text-red-800',
      condition: 'bg-purple-100 text-purple-800',
      report: 'bg-green-100 text-green-800'
    }
    return colors[type as keyof typeof colors]
  }

  const getTypeGradient = (type: string) => {
    const gradients = {
      prescription: 'from-blue-50 to-blue-100/50',
      allergy: 'from-red-50 to-red-100/50',
      condition: 'from-purple-50 to-purple-100/50',
      report: 'from-green-50 to-green-100/50'
    }
    return gradients[type as keyof typeof gradients]
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || records.length === 0) {
    return (
      <ErrorState 
        message={error || 'No records found or link has expired'} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shared Medical Records
          </h1>
          <p className="text-gray-600">
            View-only access to selected medical records
          </p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">
                Temporary Access
              </h3>
              <p className="text-amber-700 text-sm mt-1">
                This shared link expires in 5 minutes for security. Save or download any necessary information before it expires.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Records Grid */}
        <div className="space-y-6">
          <AnimatePresence>
            {records.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`card bg-gradient-to-br ${getTypeGradient(record.type)}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(record.type)}`}>
                      {record.type}
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900 mt-2">
                      {record.title}
                    </h2>
                  </div>
                  {record.is_emergency && (
                    <div className="bg-red-100 p-2 rounded-lg">
                      <AlertTriangle className="text-red-500 w-5 h-5" />
                    </div>
                  )}
                </div>

                {record.description && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-600 mb-6"
                  >
                    {record.description}
                  </motion.p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {record.hospital_name && (
                    <div className="flex items-center text-gray-600">
                      <Hospital className="w-5 h-5 mr-2 text-gray-400" />
                      <span>{record.hospital_name}</span>
                    </div>
                  )}
                  
                  {record.doctor_name && (
                    <div className="flex items-center text-gray-600">
                      <User className="w-5 h-5 mr-2 text-gray-400" />
                      <span>{record.doctor_name}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {new Date(record.consultation_date).toLocaleDateString()}
                    </span>
                  </div>

                  {record.file_url && (
                    <motion.a
                      href={record.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:text-primary/90"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download File
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center text-sm text-gray-500 flex items-center justify-center"
        >
          <Clock className="w-4 h-4 mr-2" />
          Shared via MediVault
        </motion.div>
      </main>
    </div>
  )
}