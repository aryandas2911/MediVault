import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, FileText, Pencil, Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import { getMedicalRecords } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { MedicalRecord, MedicalRecordType } from '../types/database'

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="mt-2 text-gray-600">
            View and manage your medical history
          </p>
        </div>

        {/* Filters - Sticky Bar */}
        <div className="sticky top-0 z-10 bg-white shadow-md rounded-xl p-4 mb-6">
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
            <select
              className="input-field"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as MedicalRecordType | '')}
            >
              <option value="">All Types</option>
              <option value="prescription">Prescription</option>
              <option value="allergy">Allergy</option>
              <option value="condition">Condition</option>
              <option value="report">Report</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              className="input-field"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

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
                Emergency Only
              </label>
            </div>
          </div>
        </div>

        {/* Records Grid */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No records found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((record) => (
              <div key={record.id} className="card hover:shadow-lg transition-shadow">
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
                    <AlertTriangle className="text-amber-500 w-6 h-6" />
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {record.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500 mb-6">
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
                    <a
                      href={record.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:text-primary/90"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View File
                    </a>
                  )}
                  <button
                    onClick={() => navigate(`/edit-record/${record.id}`)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}