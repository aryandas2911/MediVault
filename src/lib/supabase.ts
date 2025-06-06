import { createClient } from '@supabase/supabase-js'
import { User, MedicalRecord, UserProfile } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
  },
})

// User operations
export const createUserProfile = async (userData: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .limit(1)
    
    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

export const updateExtendedProfile = async (userId: string, profile: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ id: userId, ...profile })
      .select()
      .single()
    
    if (error) throw error
    return data as UserProfile
  } catch (error) {
    console.error('Error updating extended profile:', error)
    throw error
  }
}

// Medical record operations
export const createMedicalRecord = async (record: Partial<MedicalRecord>) => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .insert([record])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating medical record:', error)
    throw error
  }
}

export const getMedicalRecords = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as MedicalRecord[]
  } catch (error) {
    console.error('Error getting medical records:', error)
    throw error
  }
}

export const getMedicalRecord = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as MedicalRecord
  } catch (error) {
    console.error('Error getting medical record:', error)
    throw error
  }
}

export const updateMedicalRecord = async (id: string, record: Partial<MedicalRecord>) => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .update(record)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating medical record:', error)
    throw error
  }
}

export const deleteMedicalRecord = async (id: string) => {
  try {
    const { error } = await supabase
      .from('medical_records')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  } catch (error) {
    console.error('Error deleting medical record:', error)
    throw error
  }
}

// Dashboard statistics
export const getDashboardStats = async (userId: string) => {
  try {
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
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    throw error
  }
}

// Recent activity
export const getRecentActivity = async (userId: string, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data as MedicalRecord[]
  } catch (error) {
    console.error('Error getting recent activity:', error)
    throw error
  }
}

// File upload
export const uploadFile = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('medical_files')
      .upload(fileName, file)
    
    if (uploadError) throw uploadError
    return fileName
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Get signed URL for file
export const getSignedFileUrl = async (filePath: string) => {
  try {
    // If the filePath is a full URL, extract just the path part after the bucket name
    let path = filePath
    if (filePath.includes('medical_files/')) {
      path = filePath.split('medical_files/').pop() || ''
    }
    
    const { data, error } = await supabase.storage
      .from('medical_files')
      .createSignedUrl(path, 3600) // 1 hour expiry
    
    if (error) throw error
    return data.signedUrl
  } catch (error) {
    console.error('Error getting signed URL:', error)
    throw error
  }
}

// Delete file from storage
export const deleteFile = async (filePath: string) => {
  try {
    // If the filePath is a full URL, extract just the path part after the bucket name
    let path = filePath
    if (filePath.includes('medical_files/')) {
      path = filePath.split('medical_files/').pop() || ''
    }
    
    const { error } = await supabase.storage
      .from('medical_files')
      .remove([path])
    
    if (error) throw error
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}