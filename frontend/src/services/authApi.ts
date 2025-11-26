import axios from 'axios'
import { storeAuthData, clearAuthData } from '../utils/auth'
import type { UserProfile } from '../types/product'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Create axios instance with auth interceptor
export const authAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to attach token
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginRequest {
  usernameOrEmail: string
  password: string
}

export interface AuthResponse {
  token: string
  type: string
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
}

export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  email: string
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    const authResponse = response.data
    
    // Store auth data
    const user: UserProfile = {
      id: authResponse.id,
      username: authResponse.username,
      email: authResponse.email,
      firstName: authResponse.firstName || '',
      lastName: authResponse.lastName || '',
      status: 'ACTIVE',
    }
    storeAuthData(authResponse.token, user)
    
    return authResponse
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    const authResponse = response.data
    
    // Store auth data
    const user: UserProfile = {
      id: authResponse.id,
      username: authResponse.username,
      email: authResponse.email,
      firstName: authResponse.firstName || '',
      lastName: authResponse.lastName || '',
      status: 'ACTIVE',
    }
    storeAuthData(authResponse.token, user)
    
    return authResponse
  },
  
  logout: () => {
    clearAuthData()
  },
  
  // Get current user profile
  getCurrentProfile: async (): Promise<UserProfile> => {
    const response = await authAxios.get('/users/me')
    return response.data
  },
  
  // Update current user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await authAxios.put('/users/me', data)
    // Update stored user data
    const updatedUser = response.data
    localStorage.setItem('user', JSON.stringify(updatedUser))
    return updatedUser
  },
}
