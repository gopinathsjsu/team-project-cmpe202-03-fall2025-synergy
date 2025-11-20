import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },
}

