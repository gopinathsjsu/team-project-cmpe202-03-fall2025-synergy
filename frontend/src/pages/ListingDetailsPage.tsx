import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Bookmark, Loader2, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { productApi } from '../services/productApi'
import type { Product } from '../services/productApi'
import { api } from '../lib/api'
import { getCurrentUserId } from '../utils/auth'

const ListingDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const handleChatWithSeller = async () => {
    if (!product) return
    
    // Check if user is logged in
    const currentUserId = getCurrentUserId()
    if (!currentUserId) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/listings/${product.id}` } })
      return
    }
    
    // Check if user is trying to chat with themselves
    if (product.sellerId && currentUserId === product.sellerId) {
      alert("You cannot chat with yourself about your own product!")
      return
    }
    
    try {
      const productId = Number(product.id)
      const sellerId = product.sellerId ?? 4
      
      // Call API to start/get chat - buyer_id will be extracted from JWT on backend
      const chatDTO = await api.startChat({
        product_id: productId,
        buyer_id: currentUserId, // Will be overridden by JWT on backend
        seller_id: Number(sellerId),
      })
      
      console.log('Chat started/retrieved:', chatDTO)
      
      // Navigate to chat page focused on this chat
      navigate(`/chat?chatId=${chatDTO.id}`, { replace: false })
    } catch (e: unknown) {
      const error = e as { response?: { data?: { error?: string } }; message?: string }
      const errorMessage = error.response?.data?.error || error.message || "Failed to start chat"
      console.error("Failed to start chat:", errorMessage)
      alert(`Failed to start chat: ${errorMessage}`)
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Invalid product ID')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const productData = await productApi.getById(Number(id))
        setProduct(productData)
      } catch (err: unknown) {
        console.error('[ListingDetailsPage] Error fetching product:', err)
        const error = err as { response?: { status?: number; data?: { error?: string } }; message?: string }
        if (error.response?.status === 404) {
          setError('Product not found')
        } else {
          setError(error.response?.data?.error || error.message || 'Failed to load product')
        }
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card text-center py-16">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/listings" 
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          to="/listings" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> 
          Back to Listings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-4">
            <img 
              src={product.imageUrl || 'https://placehold.co/800x400?text=No+Image'} 
              alt={product.name} 
              className="w-full h-80 object-cover rounded-lg" 
            />
          </div>

          <div className="card">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-4xl font-bold text-primary-600 mb-6">${product.price}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
              {product.category && (
                <span className="px-3 py-1 bg-gray-100 rounded-full">
                  {product.category}
                </span>
              )}
              {product.condition && (
                <span className="px-3 py-1 bg-gray-100 rounded-full">
                  Condition: {product.condition}
                </span>
              )}
              {product.status && (
                <span className={`px-3 py-1 rounded-full ${
                  product.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
              )}
            </div>

            {product.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {product.createdAt && (
              <div className="text-sm text-gray-500 pt-4 border-t">
                <p>Listed: {new Date(product.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <button 
              onClick={handleChatWithSeller}
              className="btn-primary w-full flex items-center justify-center space-x-2 mb-3"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat with seller</span>
            </button>
            <button 
              className="btn-secondary w-full flex items-center justify-center space-x-2"
              onClick={() => {
                console.log('Save clicked')
              }}
            >
              <Bookmark className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>

          {product.sellerId && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Seller Information</h3>
              <p className="text-sm text-gray-600">Seller ID: {product.sellerId}</p>
              <p className="text-sm text-gray-500 mt-1">Verified student</p>
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Product ID</dt>
                <dd className="text-gray-900 font-medium">{product.id}</dd>
              </div>
              {product.category && (
                <div>
                  <dt className="text-gray-500">Category</dt>
                  <dd className="text-gray-900 font-medium">{product.category}</dd>
                </div>
              )}
              {product.condition && (
                <div>
                  <dt className="text-gray-500">Condition</dt>
                  <dd className="text-gray-900 font-medium">{product.condition}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetailsPage

