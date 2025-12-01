import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Upload, X, DollarSign, Tag, Loader2, AlertCircle } from 'lucide-react'
import { productApi } from '../services/productApi'
import { Toast } from '../components/Toast'
import type { Product } from '../services/productApi'

const EditListingPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'good'
  })
  const [images, setImages] = useState<File[]>([])
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string>('')
  const [toast, setToast] = useState<{ message: string; type?: 'error' | 'success' | 'info' } | null>(null)

  const categories = [
    'Textbooks',
    'Electronics',
    'Furniture',
    'Gaming',
    'Clothing',
    'Sports',
    'Other'
  ]

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ]

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Invalid product ID')
        setFetching(false)
        return
      }

      try {
        setFetching(true)
        setError('')
        const productData = await productApi.getById(Number(id))
        setProduct(productData)
        
        // Check if user is the seller
        const userId = localStorage.getItem('userId')
        const sellerId = productData.sellerId || productData.seller_id
        if (!userId || !sellerId || Number(sellerId) !== Number(userId)) {
          setError('You do not have permission to edit this listing')
          setFetching(false)
          return
        }

        // Prefill form with existing data
        setFormData({
          title: productData.name || '',
          description: productData.description || '',
          price: productData.price?.toString() || '',
          category: productData.category || '',
          condition: productData.condition || 'good'
        })
        
        if (productData.imageUrl) {
          setExistingImageUrl(productData.imageUrl)
        }
      } catch (err: unknown) {
        console.error('Error fetching product:', err)
        const error = err as { response?: { status?: number; data?: { error?: string } }; message?: string }
        if (error.response?.status === 404) {
          setError('Product not found')
        } else {
          setError(error.response?.data?.error || error.message || 'Failed to load product')
        }
      } finally {
        setFetching(false)
      }
    }

    fetchProduct()
  }, [id])

  // Convert image file to base64 data URL
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!id) {
        setError('Invalid product ID')
        setLoading(false)
        return
      }

      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim() || !formData.price || !formData.category) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Convert first image to base64 if a new image was uploaded
      let imageUrl: string | undefined = undefined
      if (images.length > 0) {
        try {
          const base64 = await fileToBase64(images[0])
          if (base64.length > 1000000) { // ~1MB limit
            console.warn('Image too large, skipping base64 encoding')
            imageUrl = existingImageUrl || undefined
          } else {
            imageUrl = base64
          }
        } catch (err) {
          console.error('Error converting image:', err)
          imageUrl = existingImageUrl || undefined
        }
      } else {
        // Keep existing image if no new image uploaded
        imageUrl = existingImageUrl || undefined
      }

      // Update product object
      const productData = {
        name: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        imageUrl: imageUrl,
      }

      // Call API to update product
      await productApi.update(Number(id), productData)
      
      // Success - show toast and redirect
      setToast({ message: 'Listing updated successfully', type: 'success' })
      setTimeout(() => {
        navigate(`/listings/${id}`, { replace: false, state: { refresh: true } })
      }, 1500)
    } catch (err: unknown) {
      console.error('Error updating listing:', err)
      const error = err as { response?: { data?: { error?: string } }; message?: string }
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update listing. Please try again.'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages([...images, ...files])
    // Clear existing image URL when new image is uploaded
    if (files.length > 0) {
      setExistingImageUrl(null)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-16">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Listing</h1>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="What are you selling?"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Describe your item in detail..."
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field pl-10"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              id="condition"
              name="condition"
              required
              value={formData.condition}
              onChange={handleChange}
              className="input-field"
            >
              {conditions.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos
            </label>
            
            {/* Show existing image if available */}
            {existingImageUrl && images.length === 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current image:</p>
                <div className="relative inline-block">
                  <img
                    src={existingImageUrl}
                    alt="Current listing"
                    className="w-48 h-32 object-cover rounded-lg border"
                  />
                </div>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="images" className="btn-primary cursor-pointer">
                  {existingImageUrl ? 'Change Photo' : 'Upload Photos'}
                </label>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Upload up to 10 photos (PNG, JPG, GIF)
                </p>
              </div>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/listings/${id}`)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Listing'}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default EditListingPage

