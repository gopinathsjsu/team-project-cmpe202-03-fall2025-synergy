import axios from 'axios'

// Use proxy in development, or full URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface UserCountResponse {
  total: number
  active: number
}

// Backend User model (matches Spring Boot User entity)
// Note: password field is excluded from JSON responses for security
export interface BackendUser {
  id: number
  username: string
  email: string
  firstName: string | null
  lastName: string | null
  status: 'ACTIVE' | 'SUSPENDED'
}

export const adminApi = {
  getUserCount: async (): Promise<UserCountResponse> => {
    const response = await api.get<UserCountResponse>('/users/count')
    return response.data
  },
  
  getUserList: async (): Promise<BackendUser[]> => {
    const response = await api.get<BackendUser[]>('/users')
    return response.data
  },
  
  updateUserStatus: async (userId: number, status: 'ACTIVE' | 'SUSPENDED'): Promise<BackendUser> => {
    const response = await api.patch<BackendUser>(`/users/${userId}/status`, { status })
    return response.data
  },
}

