import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload } from 'lucide-react'
import Navbar from '../components/Navbar'
import { getMedicalRecord, updateMedicalRecord, uploadFile } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { MedicalRecord, MedicalRecordType } from '../types/database'

export default function EditRecord() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { session } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    setError('')
    
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
      
      navigate('/records')
    } catch (error) {
      setError('Failed to update record')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Medical Record
          </h1>
          
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
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
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
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-secondary w-full flex justify-center items-center"
            >
              {isSubmitting ? 'Updating...' : 'Update Record'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}