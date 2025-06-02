import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { createUserProfile, getUserProfile } from '../lib/supabase'
import type { User } from '../types/database'

interface AuthContextType {
  session: Session | null
  userProfile: User | null
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)

  const handleSession = async (currentSession: Session | null) => {
    setSession(currentSession)
    
    if (currentSession?.user) {
      try {
        // Try to get existing profile
        let profile = await getUserProfile(currentSession.user.id)
        
        // If profile doesn't exist, create it
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
  }

  useEffect(() => {
    // Handle initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session)
    })

    // Handle auth state changes
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

      // Create user profile after successful authentication signup
      if (data.user) {
        const profile = await createUserProfile({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName
        })
        setUserProfile(profile)
      }
    } catch (error) {
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUserProfile(null)
  }

  return (
    <AuthContext.Provider value={{ session, userProfile, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)