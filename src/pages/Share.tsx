import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { AlertTriangle } from 'lucide-react'
import Navbar from '../components/Navbar'
import { getMedicalRecords } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { MedicalRecord } from '../types/database'

export default function Share() {
  const { session } = useAuth()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

    // Clear QR code after 5 minutes
    setTimeout(() => {
      setQrCode('')
      setSelectedRecords([])
    }, 5 * 60 * 1000)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Share Records</h1>
          <p className="mt-2 text-gray-600">
            Select records to share via QR code
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {records.map((record) => (
                <div key={record.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={`record-${record.id}`}
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => handleCheckboxChange(record.id)}
                        className="mt-1 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <div>
                        <label
                          htmlFor={`record-${record.id}`}
                          className="text-lg font-semibold text-gray-900 block"
                        >
                          {record.title}
                        </label>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getTypeColor(record.type)}`}>
                          {record.type}
                        </span>
                      </div>
                    </div>
                    {record.is_emergency && (
                      <AlertTriangle className="text-amber-500 w-6 h-6 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center space-y-6">
              <button
                onClick={generateShareLink}
                disabled={selectedRecords.length === 0}
                className="btn-primary max-w-md"
              >
                Generate QR Code
              </button>

              {qrCode && (
                <div className="card max-w-md w-full text-center">
                  <QRCodeSVG
                    value={qrCode}
                    size={256}
                    className="mx-auto mb-4"
                  />
                  <p className="text-sm text-amber-600">
                    ⚠️ This QR code will expire in 5 minutes
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}