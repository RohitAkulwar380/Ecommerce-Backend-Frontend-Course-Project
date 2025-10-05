import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import axios from 'axios'

interface AdminUser {
  _id: string
  name: string
  email: string
  role: string
}

interface AdminAuthContextValue {
  admin: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
  getAuthHeaders: () => { Authorization: string } | {}
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('adminToken'))

  const checkAdminAuth = async () => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002'
    const storedToken = localStorage.getItem('adminToken')
    
    if (!storedToken) {
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(`${baseURL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
      
      if (response.data?.success && response.data.data?.role === 'admin') {
        setAdmin(response.data.data)
        setToken(storedToken)
      } else {
        // If the response indicates user is not admin, clear the stored token
        localStorage.removeItem('adminToken')
        setToken(null)
      }
    } catch (error) {
      console.log('Admin auth check failed:', error)
      // If the token is invalid, clear it
      localStorage.removeItem('adminToken')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002'
    
    try {
      const response = await axios.post(`${baseURL}/api/auth/login`, {
        email,
        password
      })

      if (response.data?.success && response.data.data?.role === 'admin') {
        setAdmin(response.data.data)
        const newToken = response.data.token
        setToken(newToken)
        localStorage.setItem('adminToken', newToken)
        return true
      }
      return false
    } catch (error) {
      console.error('Admin login failed:', error)
      return false
    }
  }

  const logout = () => {
    setAdmin(null)
    setToken(null)
    localStorage.removeItem('adminToken')
  }

  const getAuthHeaders = () => {
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
    return {}
  }

  const value: AdminAuthContextValue = {
    admin,
    loading,
    login,
    logout,
    isAdmin: admin?.role === 'admin',
    getAuthHeaders
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
