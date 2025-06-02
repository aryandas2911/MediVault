import { createClient } from '@supabase/supabase-js'
import { User, MedicalRecord } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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

// File upload
export const uploadFile = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('medical_files')
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('medical_files')
    .getPublicUrl(fileName)
  
  return publicUrl
}