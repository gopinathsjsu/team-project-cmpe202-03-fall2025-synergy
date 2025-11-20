import axios from 'axios'

// Use proxy in development, or full URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalListings: number
  openReports: number
}

export interface AdminUserRow {
  id: number
  username?: string | null
  email?: string | null
  first_name?: string | null
  last_name?: string | null
  status?: string | null
}

export interface AdminListingRow {
  id: number
  product_name?: string | null
  img?: string | null
  category?: string | null
  cond?: string | null
  description?: string | null
  price?: number | null
  [key: string]: unknown
}

export interface AdminReportRow {
  id: number
  product_id?: number | null
  listing_id?: number | null
  reason?: string | null
  status?: string | null
  [key: string]: unknown
}

export const adminApi = {
  getAdminStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>('/admin/stats')
    return response.data
  },

  getUserList: async (): Promise<AdminUserRow[]> => {
    const response = await api.get<AdminUserRow[]>('/admin/users')
    return response.data
  },

  getListings: async (): Promise<AdminListingRow[]> => {
    const response = await api.get<AdminListingRow[]>('/admin/listings')
    return response.data
  },

  getReports: async (): Promise<AdminReportRow[]> => {
    const response = await api.get<AdminReportRow[]>('/admin/reports')
    return response.data
  },

  updateUserStatus: async (userId: number, status: 'ACTIVE' | 'SUSPENDED'): Promise<void> => {
    await api.patch(`/users/${userId}/status`, { status })
  },
}

