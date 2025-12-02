import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Loader2, AlertCircle, Edit, Flag, X, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { productApi } from '../services/productApi'
import type { Product } from '../services/productApi'
import { api } from '../lib/api'
import { getCurrentUserId } from '../utils/auth'
import { Toast } from '../components/Toast'
import { subscribeToListingDeleted } from '../utils/listingEvents'

const ListingDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reporting, setReporting] = useState(false)
  const [reportError, setReportError] = useState<string>('')
  const [reportSuccess, setReportSuccess] = useState(false)
  const [toast, setToast] = useState<{ message: string; type?: 'error' | 'success' | 'info' } | null>(null)
  const [selling, setSelling] = useState(false)

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

  const handleReportClick = () => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/listings/${product?.id}` } })
      return
    }
    
    // Check if user is trying to report their own listing
    if (product?.sellerId && currentUserId === product.sellerId) {
      alert("You cannot report your own listing!")
      return
    }
    
    setShowReportModal(true)
    setReportError('')
    setReportSuccess(false)
    setReportReason('')
  }

  const handleSubmitReport = async () => {
    if (!product || !reportReason.trim()) {
      setReportError('Please provide a reason for reporting this listing')
      return
    }

    if (reportReason.trim().length > 50) {
      setReportError('Reason must be 50 characters or less')
      return
    }

    setReporting(true)
    setReportError('')
    setReportSuccess(false)

    try {
      await productApi.report(Number(product.id), reportReason.trim())
      setReportSuccess(true)
      setReportReason('')
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowReportModal(false)
        setReportSuccess(false)
      }, 2000)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message?: string }
      const errorMessage = error.response?.data?.error || error.message || 'Failed to submit report'
      setReportError(errorMessage)
    } finally {
      setReporting(false)
    }
  }

  const handleCloseReportModal = () => {
    setShowReportModal(false)
    setReportReason('')
    setReportError('')
    setReportSuccess(false)
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
  }, [id, location.state])

  useEffect(() => {
    const unsubscribe = subscribeToListingDeleted((listingId) => {
      if (Number(id) === listingId) {
        setProduct(null)
        setError('This listing has been removed by the seller.')
      }
    })
    return () => {
      unsubscribe?.()
    }
  }, [id])

  const handleMarkAsSold = async () => {
    if (!product || !id) return

    // Confirm action
    if (!window.confirm('Are you sure you want to mark this listing as sold? It will be removed from the listings page.')) {
      return
    }

    try {
      setSelling(true)
      const updatedProduct = await productApi.markAsSold(Number(id))
      setProduct(updatedProduct)
      setToast({ message: 'Listing marked as sold.', type: 'success' })
      
      // Optionally redirect after a short delay
      setTimeout(() => {
        navigate('/profile', { replace: false })
      }, 2000)
    } catch (err: unknown) {
      console.error('Error marking listing as sold:', err)
      const error = err as { response?: { data?: { error?: string } }; message?: string }
      const errorMessage = error.response?.data?.error || error.message || 'Failed to mark listing as sold. Please try again.'
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setSelling(false)
    }
  }

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
            <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={product.imageUrl || "/placeholder.png"}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png"
                }}
              />
            </div>
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
                <span className={`px-3 py-1 rounded-full font-medium ${
                  product.status === 'ACTIVE' || product.status === 'active'
                    ? 'bg-green-100 text-green-800' 
                    : product.status === 'SOLD' || product.status === 'sold'
                    ? 'bg-blue-100 text-blue-800 font-bold'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.status === 'SOLD' || product.status === 'sold' ? 'SOLD' : product.status}
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
          {/* Show Edit and Sell buttons if user is the seller */}
          {(() => {
            const currentUserId = getCurrentUserId()
            const sellerId = product.sellerId || product.seller_id
            const isSeller = sellerId && currentUserId && Number(sellerId) === Number(currentUserId)
            const isSold = product.status === 'SOLD' || product.status === 'sold'
            return isSeller
          })() && (
            <>
              {(() => {
                const isSold = product.status === 'SOLD' || product.status === 'sold'
                return !isSold
              })() && (
                <>
                  <div className="card">
                    <button 
                      onClick={() => navigate(`/listings/${product.id}/edit`)}
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Listing</span>
                    </button>
                  </div>
                  <div className="card">
                    <button 
                      onClick={handleMarkAsSold}
                      disabled={selling}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{selling ? 'Marking as Sold...' : 'Mark as Sold'}</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          <div className="card space-y-3">
            <button 
              onClick={handleChatWithSeller}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat with seller</span>
            </button>
            
            {/* Report button - only show if user is not the seller */}
            {(() => {
              const currentUserId = getCurrentUserId()
              const sellerId = product.sellerId || product.seller_id
              const isSeller = sellerId && currentUserId && Number(sellerId) === Number(currentUserId)
              return !isSeller && (
                <button 
                  onClick={handleReportClick}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Flag className="h-4 w-4" />
                  <span>Report Listing</span>
                </button>
              )
            })()}
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Report Listing</h2>
              <button
                onClick={handleCloseReportModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={reporting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="text-center py-4">
                <div className="text-green-600 mb-2">
                  <CheckCircle className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-lg font-semibold text-gray-900">Report Submitted Successfully</p>
                <p className="text-sm text-gray-600 mt-2">Thank you for your report. We will review it shortly.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Please provide a reason for reporting this listing. Our team will review your report.
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Reporting
                    <span className="text-gray-500 text-xs ml-1">(max 50 characters)</span>
                  </label>
                  <textarea
                    value={reportReason}
                    onChange={(e) => {
                      if (e.target.value.length <= 50) {
                        setReportReason(e.target.value)
                      }
                    }}
                    placeholder="e.g., Inappropriate content, misleading information, spam, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={4}
                    disabled={reporting}
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {reportReason.length}/50 characters
                  </p>
                </div>

                {reportError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{reportError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseReportModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={reporting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    disabled={reporting || !reportReason.trim()}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {reporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Report</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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

export default ListingDetailsPage

