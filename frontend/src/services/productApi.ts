import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export type Product = {
  id: number
  name: string
  description?: string
  price: number
  category?: string
  condition?: string
  sellerId?: number
  imageUrl?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export const productApi = {
  search: async (query: string, limit?: number): Promise<Product[]> => {
    const params = new URLSearchParams()
    if (query) params.append('q', query)
    if (limit) params.append('limit', limit.toString())
    
    const response = await api.get<Product[]>(`/products/search?${params.toString()}`)
    return response.data
  },

  getActive: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/active')
    return response.data
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/category/${category}`)
    return response.data
  },
}

