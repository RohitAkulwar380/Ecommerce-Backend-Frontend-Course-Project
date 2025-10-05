import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getMe } from '@/lib/api'
import { getAbsoluteUrl } from '@/lib/utils'

interface User {
  _id: string
  name: string
  email: string
  role?: string
  avatar?: string
}

interface AuthContextValue {
  user: User | null
  isAdmin: boolean
  setUser: (u: User | null) => void
  login: (userData: User) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...')
        const userData = await getMe()
        console.log('User data from getMe:', userData)
        if (userData?.avatar) {
          userData.avatar = getAbsoluteUrl(userData.avatar)
        }
        setUser(userData)
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAdmin: user?.role === 'admin',
        setUser, 
        login, 
        logout, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
