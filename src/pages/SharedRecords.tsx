import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AlertTriangle, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { MedicalRecord } from '../types/database'

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white p-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error || records.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white p-8">
        <div className="text-center text-red-500">
          {error || 'No records found or link has expired'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <p className="text-amber-700 text-sm flex items-center">
            🔒 This link expires in 5 minutes
          </p>
        </div>

        <div className="space-y-6">
          {records.map((record) => (
            <div key={record.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {record.title}
                  </h2>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getTypeColor(record.type)}`}>
                    {record.type}
                  </span>
                </div>
                {record.is_emergency && (
                  <AlertTriangle className="text-amber-500 w-6 h-6 flex-shrink-0" />
                )}
              </div>

              {record.description && (
                <p className="text-gray-600 mb-4">{record.description}</p>
              )}

              <div className="space-y-2 text-sm text-gray-500">
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

              {record.file_url && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={record.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/90"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View File
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}