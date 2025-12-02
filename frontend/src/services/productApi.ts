import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for product requests
})

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('[API Request]', config.method?.toUpperCase(), config.url, {
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`
  })
  return config
})

// Log all responses for debugging
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url, {
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('[API Error]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
)

/**
 * Product type matching backend ProductResponseDto (snake_case JSON)
 */
export type Product = {
  id: number
  name: string
  description?: string
  price: number
  category?: string
  condition?: string
  seller_id?: number  // Backend uses snake_case
  image_url?: string  // Backend uses snake_case
  status?: string
  created_at?: string  // Backend uses snake_case
  updated_at?: string  // Backend uses snake_case
  match_percentage?: number  // Backend uses snake_case
  
  // Legacy camelCase fields (computed from snake_case)
  sellerId?: number
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
  matchPercentage?: number
}

/**
 * Normalize product to have both snake_case and camelCase properties
 */
function normalizeProduct(product: Product): Product {
  return {
    ...product,
    // Ensure both naming conventions are available
    sellerId: product.sellerId || product.seller_id,
    seller_id: product.seller_id || product.sellerId,
    imageUrl: product.imageUrl || product.image_url,
    image_url: product.image_url || product.imageUrl,
    createdAt: product.createdAt || product.created_at,
    created_at: product.created_at || product.createdAt,
    updatedAt: product.updatedAt || product.updated_at,
    updated_at: product.updated_at || product.updatedAt,
    matchPercentage: product.matchPercentage || product.match_percentage,
    match_percentage: product.match_percentage || product.matchPercentage,
  }

}

// Spring Data JPA Page response format
export type PageResponse<T> = {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
    }
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  size: number
  number: number
  numberOfElements: number
  empty: boolean
}

// Legacy paginated response (for backward compatibility)
export type PaginatedResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean

}

export const productApi = {
  search: async (query: string, limit?: number): Promise<Product[]> => {
    const params = new URLSearchParams()
    if (query) params.append('q', query)
    if (limit) params.append('limit', limit.toString())
    
    const response = await api.get<Product[]>(`/products/search?${params.toString()}`)
    return response.data.map(normalizeProduct)
  },

  getActive: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/active')
    return response.data.map(normalizeProduct)
  },

  /**
   * Get all products (no pagination - for client-side filtering/pagination)
   * @returns Array of all products from the database
   */
  getAll: async (): Promise<Product[]> => {
    console.log('[productApi] Fetching all products from: /products')
    try {
      const response = await api.get<Product[]>('/products')
      console.log('[productApi] ✅ All products received:', {
        status: response.status,
        count: response.data?.length || 0
      })
      return response.data.map(normalizeProduct)
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { status?: number }; config?: { url?: string } };
      console.error('[productApi] ❌ Error fetching all products:', {
        message: err.message,
        status: err.response?.status,
        url: err.config?.url
      })
      throw error
    }
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`)
    return normalizeProduct(response.data)
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/category/${category}`)
    return response.data.map(normalizeProduct)
  },

  getBySeller: async (sellerId: number): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/seller/${sellerId}`)
    return response.data.map(normalizeProduct)
  },

  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await api.post<Product>('/products', product)
    return normalizeProduct(response.data)
  },

  update: async (id: number, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, product)
    return normalizeProduct(response.data)
  },

  markAsSold: async (id: number): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, { status: 'SOLD' })
    return normalizeProduct(response.data)
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/listings/${id}`)
  },

  /**
   * Get paginated listings (Spring Data JPA Page format)
   * @param page Zero-based page index (default: 0)
   * @param size Number of items per page (default: 10)
   */
  getListings: async (page: number = 0, size: number = 10): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('size', size.toString())
    
    const url = `/listings?${params.toString()}`
    const fullUrl = `${api.defaults.baseURL}${url}`
    console.log('[productApi] Fetching listings from:', fullUrl)
    console.log('[productApi] API base URL:', api.defaults.baseURL)
    
    try {
      const response = await api.get<PageResponse<Product>>(url)
      console.log('[productApi] ✅ Listings response received:', {
        status: response.status,
        statusText: response.statusText,
        contentLength: response.data?.content?.length || 0,
        totalElements: response.data?.totalElements || 0,
        totalPages: response.data?.totalPages || 0,
        pageNumber: response.data?.number,
        pageSize: response.data?.size
      })
      
      // Convert Spring Data Page format to our PaginatedResponse format
      const pageData = response.data
      const paginatedResponse: PaginatedResponse<Product> = {
        content: pageData.content || [],
        page: pageData.number || 0,
        size: pageData.size || size,
        totalElements: pageData.totalElements || 0,
        totalPages: pageData.totalPages || 0,
        first: pageData.first || false,
        last: pageData.last || false
      }
      
      return paginatedResponse
    } catch (error: unknown) {
      const err = error as { 
        message?: string; 
        code?: string; 
        response?: { status?: number; statusText?: string; data?: unknown }; 
        config?: { url?: string; method?: string } 
      };
      const errorDetails = {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        requestUrl: err.config?.url,
        requestMethod: err.config?.method,
        fullUrl: fullUrl,
        baseURL: api.defaults.baseURL
      }
      console.error('[productApi] ❌ Error fetching listings:', errorDetails)
      
      // Provide more helpful error messages
      if (err.response?.status === 404) {
        throw new Error(`Endpoint not found: ${fullUrl}. Make sure the backend is running and the endpoint exists.`)
      } else if (err.response?.status === 0 || err.code === 'ERR_NETWORK') {
        throw new Error(`Network error: Cannot connect to backend at ${api.defaults.baseURL}. Is the backend running on port 8080?`)
      } else if (err.response?.status === 403 || err.response?.status === 401) {
        throw new Error(`Access denied: ${(err.response?.data as { message?: string })?.message || 'Check CORS configuration'}`)
      } else {
        throw new Error((err.response?.data as { error?: string })?.error || err.message || 'Failed to fetch listings')
      }
    }
  },

  /**
   * Report a listing
   * @param productId ID of the product to report
   * @param reason Reason for reporting
   */
  report: async (productId: number, reason: string): Promise<void> => {
    const response = await api.post('/reports', {
      productId,
      reason
    })
    return response.data
  },
}

