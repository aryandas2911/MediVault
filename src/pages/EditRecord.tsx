import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, FileText, Trash2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMedicalRecord, updateMedicalRecord, uploadFile, deleteMedicalRecord, deleteFile } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { MedicalRecordType } from '../types/database'

export default function EditRecord() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { session } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'prescription' as MedicalRecordType,
    description: '',
    hospitalName: '',
    doctorName: '',
    consultationDate: '',
    isEmergency: false,
  })
  
  const [currentFileUrl, setCurrentFileUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (id) {
      loadRecord()
    }
  }, [id])

  const loadRecord = async () => {
    try {
      const record = await getMedicalRecord(id!)
      setFormData({
        title: record.title,
        type: record.type,
        description: record.description || '',
        hospitalName: record.hospital_name || '',
        doctorName: record.doctor_name || '',
        consultationDate: record.consultation_date || '',
        isEmergency: record.is_emergency || false,
      })
      setCurrentFileUrl(record.file_url || '')
    } catch (error) {
      setError('Failed to load record')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user.id || !id) return
    
    setIsSubmitting(true)
    
    try {
      let fileUrl = currentFileUrl
      if (file) {
        fileUrl = await uploadFile(file, session.user.id)
      }
      
      await updateMedicalRecord(id, {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        hospital_name: formData.hospitalName,
        doctor_name: formData.doctorName,
        consultation_date: formData.consultationDate,
        is_emergency: formData.isEmergency,
        file_url: fileUrl,
      })
      
      toast.success('Record updated successfully')
      navigate('/records')
    } catch (error) {
      toast.error('Failed to update record')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    
    try {
      await deleteMedicalRecord(id)
      if (currentFileUrl) {
        await deleteFile(currentFileUrl)
      }
      toast.success('Record deleted successfully')
      navigate('/records')
    } catch (error) {
      toast.error('Failed to delete record')
      console.error(error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Edit Medical Record
                  </h1>
                  <motion.button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        required
                        className="input-field mt-1"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Record Type
                      </label>
                      <select
                        id="type"
                        required
                        className="input-field mt-1"
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          type: e.target.value as MedicalRecordType 
                        }))}
                      >
                        <option value="prescription">Prescription</option>
                        <option value="allergy">Allergy</option>
                        <option value="condition">Condition</option>
                        <option value="report">Report</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        className="input-field mt-1"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">
                        Hospital Name
                      </label>
                      <input
                        type="text"
                        id="hospitalName"
                        className="input-field mt-1"
                        value={formData.hospitalName}
                        onChange={(e) => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
                        Doctor Name
                      </label>
                      <input
                        type="text"
                        id="doctorName"
                        className="input-field mt-1"
                        value={formData.doctorName}
                        onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="consultationDate" className="block text-sm font-medium text-gray-700">
                        Consultation Date
                      </label>
                      <input
                        type="date"
                        id="consultationDate"
                        className="input-field mt-1"
                        value={formData.consultationDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, consultationDate: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isEmergency"
                        className="h-4 w-4 text-secondary rounded border-gray-300 focus:ring-secondary"
                        checked={formData.isEmergency}
                        onChange={(e) => setFormData(prev => ({ ...prev, isEmergency: e.target.checked }))}
                      />
                      <label htmlFor="isEmergency" className="ml-2 block text-sm text-gray-700">
                        Mark as Emergency
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current File
                      </label>
                      {currentFileUrl ? (
                        <a
                          href={currentFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-primary hover:text-primary/90"
                        >
                          View Current File
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-gray-500">No file uploaded</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Upload New File (Optional)
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary/60 transition-colors">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF, PNG, JPG up to 10MB
                          </p>
                        </div>
                      </div>
                      {file && (
                        <p className="mt-2 text-sm text-gray-600 flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {file.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex justify-center items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Record'}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="card bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Editing Tips
                  </h2>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li>• Make sure changes reflect your latest consultation</li>
                  <li>• Double-check dates and doctor information</li>
                  <li>• Use emergency toggle only for critical records</li>
                  <li>• Keep descriptions clear and concise</li>
                </ul>
              </div>

              <motion.button
                onClick={() => navigate('/records')}
                className="card mt-6 w-full text-left hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Back to Records
                </h3>
                <p className="text-sm text-gray-600">
                  Return to your medical records overview
                </p>
              </motion.button>
            </motion.div>
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Delete Record
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this record? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <motion.button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}