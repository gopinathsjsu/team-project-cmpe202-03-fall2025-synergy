import axios from 'axios'
import { storeAuthData, clearAuthData } from '../utils/auth'
import type { UserProfile } from '../types/product'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Create axios instance with auth interceptor
export const authAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Log request for debugging
  console.log('[API Request]', config.method?.toUpperCase(), config.url, {
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`
  })
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('[API Error]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      code: error.code,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('userAuth')
      localStorage.removeItem('userId')
      // Optionally redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
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

export interface User {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  status?: string
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
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
    } catch (error: unknown) {
      const err = error as { 
        response?: { 
          status?: number
          data?: { error?: string } 
        }
        message?: string
        code?: string
      }
      
      // Re-throw with better error message for network errors
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED' || !err.response) {
        throw new Error('Network error: Cannot connect to backend. Please make sure the backend is running on port 8080.')
      }
      
      throw error
    }
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
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
    } catch (error: unknown) {
      const err = error as { 
        response?: { 
          status?: number
          data?: { error?: string } 
        }
        message?: string
        code?: string
      }
      
      // Re-throw with better error message for network errors
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED' || !err.response) {
        throw new Error('Network error: Cannot connect to backend. Please make sure the backend is running on port 8080.')
      }
      
      throw error
    }
  },
  
  logout: () => {
    clearAuthData()
  },
  
  // Get current user profile
  getCurrentProfile: async (): Promise<UserProfile> => {
    const response = await authAxios.get('/users/me')
    return response.data
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`)
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
