import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, DollarSign, Tag, Loader2 } from 'lucide-react'
import { productApi } from '../services/productApi'
import { imageApi } from '../services/imageApi'

const CreateListingPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'good'
  })
  const [images, setImages] = useState<File[]>([])
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

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

  // Upload image to S3
  const uploadImageToS3 = async (file: File, category: string): Promise<string> => {
    try {
      setUploadingImage(true)
      const imageUrl = await imageApi.uploadImage(file, category)
      setUploadedImageUrl(imageUrl)
      return imageUrl
    } catch (err) {
      console.error('Error uploading image to S3:', err)
      const error = err as { response?: { data?: { error?: string } }; message?: string }
      throw new Error(error.response?.data?.error || error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setError('You must be logged in to create a listing')
        setLoading(false)
        return
      }

      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim() || !formData.price || !formData.category) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Upload image to S3 if available
      let imageUrl: string | undefined = undefined
      if (images.length > 0) {
        try {
          // Upload first image to S3
          imageUrl = await uploadImageToS3(images[0], formData.category)
          console.log('Image uploaded to S3:', imageUrl)
        } catch (err) {
          console.error('Error uploading image:', err)
          const error = err as Error
          setError(error.message || 'Failed to upload image. Please try again.')
          setLoading(false)
          return
        }
      }

      // Create product object
      const productData = {
        name: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        sellerId: parseInt(userId),
        imageUrl: imageUrl,
        status: 'ACTIVE'
      }

      // Call API to create product
      await productApi.create(productData)
      
      // Success - redirect to listings page or product detail page
      navigate(`/listings`, { replace: true })
    } catch (err: unknown) {
      console.error('Error creating listing:', err)
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to create listing. Please try again.')
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Only allow one image for now
      const file = files[0]
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB')
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('File must be an image')
        return
      }
      
      setImages([file])
      setUploadedImageUrl('') // Reset uploaded URL
      setError('')
      
      // Auto-upload to S3 if category is selected
      if (formData.category) {
        try {
          await uploadImageToS3(file, formData.category)
        } catch (err) {
          console.error('Auto-upload failed:', err)
          // Don't show error here, user can still submit and upload will happen on submit
        }
      }
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Listing</h1>
        
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2 description-label">
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
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2 price-label">
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
              Photo {uploadingImage && <span className="text-blue-600">(Uploading...)</span>}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadingImage ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                  <p className="text-sm text-gray-600">Uploading image to S3...</p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="images" className="btn-primary cursor-pointer">
                      Upload Photo
                    </label>
                    <input
                      id="images"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage || loading}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Upload a photo (PNG, JPG, GIF - Max 10MB)
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-4">
                <div className="relative inline-block">
                  {uploadedImageUrl ? (
                    <img
                      src={uploadedImageUrl}
                      alt="Uploaded preview"
                      className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-green-500"
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(images[0])}
                      alt="Preview"
                      className="w-full max-w-md h-64 object-cover rounded-lg"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setImages([])
                      setUploadedImageUrl('')
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    disabled={uploadingImage}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {uploadedImageUrl && (
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      ✓ Uploaded to S3
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/listings')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateListingPage
