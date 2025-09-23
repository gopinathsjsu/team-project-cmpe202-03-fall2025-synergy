import { useState } from 'react'
import { User, Settings, Heart, ShoppingBag, MessageCircle, Edit, Camera } from 'lucide-react'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('listings')

  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    avatar: 'https://via.placeholder.com/100x100?text=JD',
    joinDate: 'September 2024',
    rating: 4.8,
    totalSales: 12,
    totalPurchases: 8
  }

  const userListings = [
    {
      id: 1,
      title: 'Calculus Textbook - Stewart 8th Edition',
      price: 45,
      image: 'https://via.placeholder.com/200x150?text=Calculus',
      status: 'active',
      views: 24,
      createdAt: '2 days ago'
    },
    {
      id: 2,
      title: 'MacBook Pro 13" - 2020 Model',
      price: 1200,
      image: 'https://via.placeholder.com/200x150?text=MacBook',
      status: 'sold',
      views: 156,
      createdAt: '1 week ago'
    },
    {
      id: 3,
      title: 'Gaming Chair - Ergonomic',
      price: 150,
      image: 'https://via.placeholder.com/200x150?text=Chair',
      status: 'active',
      views: 8,
      createdAt: '3 days ago'
    }
  ]

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: ShoppingBag },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

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
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold text-gray-900">{userProfile.rating}</span>
                  <span className="text-yellow-400">★</span>
                </div>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
              
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
                <button className="btn-primary">
                  Create New Listing
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userListings.map((listing) => (
                  <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
                      <p className="text-2xl font-bold text-primary-600 mb-2">${listing.price}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                        <span>{listing.views} views</span>
                        <span>{listing.createdAt}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          listing.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.status}
                        </span>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Favorite Items</h2>
              <div className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-500">Items you favorite will appear here</p>
              </div>
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userProfile.name}
                    className="input-field"
                  />
                </div>
                
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
