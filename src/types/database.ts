export type User = {
  id: string
  full_name: string
  email: string
  date_of_birth: string
  blood_group: string
}

export type MedicalRecordType = 'prescription' | 'allergy' | 'condition' | 'report'

export type MedicalRecord = {
  id: string
  user_id: string
  title: string
  type: MedicalRecordType
  description: string
  hospital_name: string
  doctor_name: string
  consultation_date: string
  is_emergency: boolean
  file_url: string
  is_verified: boolean
  created_at: string
  updated_at: string
}