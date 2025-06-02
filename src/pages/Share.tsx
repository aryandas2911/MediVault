import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  AlertTriangle, Share2, QrCode, Shield,
  Clock, ChevronRight, FileText, Info
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { getMedicalRecords } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { MedicalRecord } from '../types/database'

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

export default function Share() {
  const { session } = useAuth()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (session?.user.id) {
      loadRecords()
    }
  }, [session])

  const loadRecords = async () => {
    try {
      const data = await getMedicalRecords(session!.user.id)
      setRecords(data)
    } catch (error) {
      setError('Failed to load medical records')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckboxChange = (recordId: string) => {
    setSelectedRecords(prev => {
      if (prev.includes(recordId)) {
        return prev.filter(id => id !== recordId)
      }
      return [...prev, recordId]
    })
  }

  const generateShareLink = () => {
    if (selectedRecords.length === 0) {
      setError('Please select at least one record')
      return
    }

    const shareLink = `${window.location.origin}/shared/${selectedRecords.join(',')}`
    setQrCode(shareLink)
    setError('')

    // Clear QR code after 5 minutes
    setTimeout(() => {
      setQrCode('')
      setSelectedRecords([])
    }, 5 * 60 * 1000)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
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
          <h1 className="text-3xl font-bold text-gray-900">Share Records</h1>
          <p className="mt-2 text-gray-600">
            Select records to share via QR code
          </p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="card bg-blue-50 border border-blue-100">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">
                  Secure Sharing
                </h3>
                <p className="text-blue-700 text-sm mt-1">
                  Shared records are view-only and automatically expire after 5 minutes for your security.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

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
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Records Selection */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {records.map((record) => (
                  <FadeInWhenVisible key={record.id}>
                    <motion.div 
                      className="card hover:shadow-lg transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          id={`record-${record.id}`}
                          checked={selectedRecords.includes(record.id)}
                          onChange={() => handleCheckboxChange(record.id)}
                          className="mt-1 h-4 w-4 text-primary rounded border-gray-300 
                                   focus:ring-primary cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <label
                                htmlFor={`record-${record.id}`}
                                className="text-lg font-semibold text-gray-900 block cursor-pointer"
                              >
                                {record.title}
                              </label>
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
                          
                          <div className="mt-4 space-y-2 text-sm text-gray-600">
                            {record.doctor_name && (
                              <p>Doctor: {record.doctor_name}</p>
                            )}
                            {record.consultation_date && (
                              <p>Date: {new Date(record.consultation_date).toLocaleDateString()}</p>
                            )}
                          </div>

                          {record.file_url && (
                            <div className="mt-4 flex items-center text-primary text-sm">
                              <FileText className="w-4 h-4 mr-1" />
                              File attached
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </FadeInWhenVisible>
                ))}
              </div>
            </div>

            {/* QR Code and Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Generate Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.button
                  onClick={generateShareLink}
                  disabled={selectedRecords.length === 0}
                  className="btn-primary w-full flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Generate QR Code
                  <span className="ml-2 text-sm">
                    ({selectedRecords.length} selected)
                  </span>
                </motion.button>
              </motion.div>

              {/* QR Code Display */}
              <AnimatePresence>
                {qrCode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="card"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <QrCode className="w-6 h-6 text-primary mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Scan QR Code
                      </h3>
                    </div>
                    
                    <QRCodeSVG
                      value={qrCode}
                      size={256}
                      className="mx-auto mb-4"
                      level="H"
                    />
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                      <input
                        type="text"
                        value={qrCode}
                        readOnly
                        className="bg-transparent text-sm text-gray-600 flex-1 mr-2"
                      />
                      <motion.button
                        onClick={() => copyToClipboard(qrCode)}
                        className="text-primary hover:text-primary/90 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </motion.button>
                    </div>

                    <div className="flex items-center text-amber-600 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Expires in 5 minutes
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tips Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="card bg-gradient-to-br from-purple-50 to-blue-50"
              >
                <div className="flex items-center mb-4">
                  <Info className="w-5 h-5 text-primary mr-2" />
                  <h3 className="font-semibold text-gray-900">
                    Sharing Tips
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <ChevronRight className="w-4 h-4 text-primary mr-2 mt-0.5" />
                    Scan the QR code from another device to view records
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="w-4 h-4 text-primary mr-2 mt-0.5" />
                    Share the link directly with healthcare providers
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="w-4 h-4 text-primary mr-2 mt-0.5" />
                    Records are view-only and cannot be modified
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}