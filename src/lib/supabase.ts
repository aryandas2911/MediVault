import { createClient } from '@supabase/supabase-js'
import { User, MedicalRecord, UserProfile } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User operations
export const createUserProfile = async (userData: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .limit(1)
  
  if (error) throw error
  return data?.[0] || null
}

// Profile operations
export const getExtendedProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data as UserProfile | null
}

export const updateExtendedProfile = async (userId: string, profile: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({ id: userId, ...profile })
    .select()
    .single()
  
  if (error) throw error
  return data as UserProfile
}

// Medical record operations
export const createMedicalRecord = async (record: Partial<MedicalRecord>) => {
  const { data, error } = await supabase
    .from('medical_records')
    .insert([record])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getMedicalRecords = async (userId: string) => {
  const { data, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as MedicalRecord[]
}

export const getMedicalRecord = async (id: string) => {
  const { data, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as MedicalRecord
}

export const updateMedicalRecord = async (id: string, record: Partial<MedicalRecord>) => {
  const { data, error } = await supabase
    .from('medical_records')
    .update(record)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteMedicalRecord = async (id: string) => {
  const { error } = await supabase
    .from('medical_records')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Dashboard statistics
export const getDashboardStats = async (userId: string) => {
  const { data: records, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error

  const today = new Date()
  const sevenDaysFromNow = new Date(today)
  sevenDaysFromNow.setDate(today.getDate() + 7)

  return {
    totalRecords: records.length,
    emergencyRecords: records.filter(r => r.is_emergency).length,
    upcomingConsultations: records.filter(r => {
      const consultDate = new Date(r.consultation_date)
      return consultDate >= today && consultDate <= sevenDaysFromNow
    }).length,
    lastUpdated: records.length > 0 
      ? new Date(Math.max(...records.map(r => new Date(r.updated_at).getTime()))).toISOString()
      : null
  }
}

// Recent activity
export const getRecentActivity = async (userId: string, limit = 5) => {
  const { data, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as MedicalRecord[]
}

// File upload
export const uploadFile = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('medical_files')
    .upload(fileName, file)
  
  if (error) throw error
  
  return fileName
}

// Get signed URL for file
export const getSignedFileUrl = async (filePath: string) => {
  const { data, error } = await supabase.storage
    .from('medical_files')
    .createSignedUrl(filePath, 3600)
  
  if (error) throw error
  return data.signedUrl
}

// Delete file from storage
export const deleteFile = async (filePath: string) => {
  const { error } = await supabase.storage
    .from('medical_files')
    .remove([filePath])
  
  if (error) throw error
}