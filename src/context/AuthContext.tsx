import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { createUserProfile, getUserProfile, updateExtendedProfile } from '../lib/supabase'
import type { UserProfile } from '../types/database'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  session: Session | null
  userProfile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, additionalData?: Partial<UserProfile>) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleSession = async (currentSession: Session | null) => {
    setSession(currentSession)
    
    if (currentSession?.user) {
      try {
        let profile = await getUserProfile(currentSession.user.id)
        
        if (!profile) {
          profile = await createUserProfile({
            id: currentSession.user.id,
            full_name: currentSession.user.user_metadata?.full_name || currentSession.user.email?.split('@')[0] || 'User'
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

  const signUp = async (email: string, password: string, fullName: string, additionalData?: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      if (error) throw error

      // Enhanced email confirmation notification
      toast.success(
        `Account created successfully! 📧\nPlease check your email (${email}) for a confirmation link to activate your account.`,
        {
          duration: 8000,
          style: {
            background: '#10B981',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            lineHeight: '1.5',
            maxWidth: '400px'
          },
          icon: '✉️'
        }
      )
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
          toast.error(
            'Please confirm your email address before logging in. Check your inbox for the confirmation link.',
            {
              duration: 6000,
              style: {
                background: '#EF4444',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                lineHeight: '1.5',
                maxWidth: '400px'
              },
              icon: '📧'
            }
          )
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
      navigate('/')
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