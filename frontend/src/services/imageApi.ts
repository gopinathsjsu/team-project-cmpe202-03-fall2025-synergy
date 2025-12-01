import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface ImageUploadResponse {
  imageUrl: string
  message: string
}

export const imageApi = {
  /**
   * Upload an image to S3
   * @param file The image file to upload
   * @param category Optional category for folder organization
   * @returns The S3 URL of the uploaded image
   */
  uploadImage: async (file: File, category?: string): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    if (category) {
      formData.append('category', category)
    }

    const response = await api.post<ImageUploadResponse>('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data.imageUrl
  },
}

