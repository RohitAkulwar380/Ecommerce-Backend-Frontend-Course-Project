import axios from 'axios'
import type { AxiosError } from 'axios'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002',
  withCredentials: true,
})

export interface User {
  _id: string
  name: string
  email: string
  role?: string
  avatar?: string
}

export async function getMe(): Promise<User | null> {
  try {
    console.log('Making getMe request to:', api.defaults.baseURL + '/api/auth/me')
    const res = await api.post<ApiResponse<User>>('/api/auth/me')
    console.log('getMe response:', res.data)
    
    if (res.data?.data) {
      const userData = res.data.data
      if (userData.avatar) {
        userData.avatar = `${api.defaults.baseURL}${userData.avatar}`
      }
      return userData
    }
    return null
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to get user data:', error.message)
      console.error('Error details:', error.response?.data)
    } else {
      console.error('Failed to get user data:', error)
    }
    return null
  }
}
