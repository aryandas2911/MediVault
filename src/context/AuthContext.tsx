import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { createUserProfile, getUserProfile } from '../lib/supabase'
import type { User } from '../types/database'
import toast from 'react-hot-toast'

interface AuthContextType {
  session: Session | null
  userProfile: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const handleSession = async (currentSession: Session | null) => {
    setSession(currentSession)
    
    if (currentSession?.user) {
      try {
        let profile = await getUserProfile(currentSession.user.id)
        
        if (!profile) {
          profile = await createUserProfile({
            id: currentSession.user.id,
            email: currentSession.user.email!,
            full_name: 'New User'
          })
        }
        
        setUserProfile(profile)
      } catch (error) {
        console.error('Error handling user profile:', error)
        setUserProfile(null)
      }
    } else {
      setUserProfile(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error

      if (data.user) {
        const profile = await createUserProfile({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName
        })
        setUserProfile(profile)
        toast.success('Account created successfully! Please check your email for confirmation.')
      }
    } catch (error) {
      toast.error('Failed to create account')
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        if (error.message === 'Email not confirmed') {
          toast.error('Please confirm your email address before logging in. Check your inbox for the confirmation link.')
        } else {
          toast.error('Invalid login credentials')
        }
        throw error
      }
      toast.success('Welcome back!')
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUserProfile(null)
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to log out')
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ session, userProfile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)