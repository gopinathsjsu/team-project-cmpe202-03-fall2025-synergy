import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, ShoppingBag, MessageCircle, Edit, Camera, Loader2 } from 'lucide-react'
import { authApi, type User } from '../services/authApi'
import { productApi, type Product } from '../services/productApi'

interface UserProfile {
  name: string
  email: string
  avatar: string
  joinDate: string
  totalSales: number
  totalPurchases: number
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('listings')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [userListings, setUserListings] = useState<Product[]>([])

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get userId from localStorage
        const userIdStr = localStorage.getItem('userId')
        if (!userIdStr) {
          setError('User not authenticated. Please log in.')
          setLoading(false)
          navigate('/login')
          return
        }

        const userId = parseInt(userIdStr, 10)
        if (isNaN(userId)) {
          setError('Invalid user ID')
          setLoading(false)
          return
        }

        // Fetch user data and listings in parallel
        const [user, listings] = await Promise.all([
          authApi.getUserById(userId).catch(err => {
            console.error('Error fetching user:', err)
            throw new Error(err.response?.data?.error || err.message || 'Failed to load user data')
          }),
          productApi.getBySeller(userId).catch(err => {
            console.error('Error fetching listings:', err)
            // Don't fail the whole page if listings fail, just return empty array
            return []
          })
        ])

        setUserData(user)
        setUserListings(Array.isArray(listings) ? listings : [])

        // Calculate stats
        const totalSales = Array.isArray(listings) 
          ? listings.filter(p => p && (p.status === 'sold' || p.status === 'SOLD')).length 
          : 0
        const totalPurchases = 0 // This would need to be tracked separately in the backend
        
        // Format join date (using current date as placeholder since User model doesn't have createdAt)
        const joinDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

        // Build user profile
        const fullName = user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user.username || 'User'

        setUserProfile({
          name: fullName,
          email: user.email || '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff&size=100`,
          joinDate: joinDate,
          totalSales,
          totalPurchases
        })

      } catch (err: unknown) {
        console.error('Error fetching profile data:', err)
        const error = err as {
          response?: {
            status?: number
            data?: {
              error?: string
            }
          }
          message?: string
        }
        
        let errorMessage = 'Failed to load profile data'
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          errorMessage = 'Authentication failed. Please log in again.'
          localStorage.removeItem('token')
          localStorage.removeItem('userAuth')
          localStorage.removeItem('userId')
          setTimeout(() => navigate('/login'), 2000)
        } else if (error.response?.status === 404) {
          errorMessage = 'User not found'
        } else if (error.message) {
          errorMessage = error.message
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: ShoppingBag },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4 font-medium">{error}</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => {
                  setError(null)
                  setLoading(true)
                  window.location.reload()
                }}
                className="btn-primary"
              >
                Retry
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="btn-secondary"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!userProfile || !userData) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="text-center py-12">
            <p className="text-gray-600">No profile data available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-24 h-24 rounded-full"
            />
            <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
              <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>
            
            <p className="text-gray-600 mb-2">{userProfile.email}</p>
            <p className="text-sm text-gray-500 mb-4">Member since {userProfile.joinDate}</p>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{userProfile.totalSales}</p>
                <p className="text-sm text-gray-500">Items Sold</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{userProfile.totalPurchases}</p>
                <p className="text-sm text-gray-500">Items Bought</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'listings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
                <button 
                  onClick={() => navigate('/create-listing')}
                  className="btn-primary"
                >
                  Create New Listing
                </button>
              </div>
              
              {userListings.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                  <p className="text-gray-500 mb-4">Start selling by creating your first listing</p>
                  <button 
                    onClick={() => navigate('/create-listing')}
                    className="btn-primary"
                  >
                    Create Listing
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userListings.map((listing: Product) => (
                    <div 
                      key={listing.id} 
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/listings/${listing.id}`)}
                    >
                      <img
                        src={listing.imageUrl ? listing.imageUrl : "/placeholder.png"}
                        alt={listing.name}
                        className="w-full h-48 object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png'
                        }}
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{listing.name}</h3>
                        <p className="text-2xl font-bold text-primary-600 mb-2">${listing.price}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                          <span>{listing.category || 'Uncategorized'}</span>
                          <span>{formatDate(listing.createdAt)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.status === 'active' || listing.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800' 
                              : listing.status === 'sold' || listing.status === 'SOLD'
                              ? 'bg-blue-100 text-blue-800 font-bold'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {listing.status === 'SOLD' || listing.status === 'sold' ? 'SOLD' : (listing.status || 'active').toUpperCase()}
                          </span>
                          {listing.status !== 'SOLD' && listing.status !== 'sold' && (
                            <button 
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation()
                                navigate(`/listings/${listing.id}/edit`)
                              }}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Messages</h2>
              <div className="text-center py-12">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-500">Your conversations will appear here</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userProfile.email}
                    className="input-field"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={userData?.username || ''}
                    className="input-field"
                    readOnly
                  />
                </div>
                
                {userData?.firstName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      className="input-field"
                      readOnly
                    />
                  </div>
                )}
                
                {userData?.lastName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      className="input-field"
                      readOnly
                    />
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
