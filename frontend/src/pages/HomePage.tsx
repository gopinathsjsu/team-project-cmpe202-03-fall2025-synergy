import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, BookOpen, Laptop, Home, Gamepad2, Loader2 } from 'lucide-react'
import { productApi } from '../services/productApi'
import type { Product } from '../services/productApi'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { name: 'Textbooks', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
    { name: 'Electronics', icon: Laptop, color: 'bg-green-100 text-green-600' },
    { name: 'Furniture', icon: Home, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Gaming', icon: Gamepad2, color: 'bg-purple-100 text-purple-600' },
  ]

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [featuredLoading, setFeaturedLoading] = useState(false)
  const [featuredError, setFeaturedError] = useState('')

  useEffect(() => {
    const fetchFeatured = async () => {
      setFeaturedLoading(true)
      setFeaturedError('')
      try {
        const products = await productApi.getAll()
        setFeaturedProducts(products)
      } catch (err: any) {
        setFeaturedError(err.response?.data?.error || err.message || 'Unable to load featured products.')
      } finally {
        setFeaturedLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Campus Marketplace
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Buy and sell textbooks, gadgets, and essentials within your campus community
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for textbooks, gadgets, essentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.name}
                to={`/listings?category=${encodeURIComponent(category.name)}`}
                className="card hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${category.color} flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Featured Listings */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
          <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        {featuredLoading ? (
          <div className="card flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600 mr-3" />
            <span className="text-gray-600">Loading featured products...</span>
          </div>
        ) : featuredError ? (
          <div className="card text-center py-10">
            <p className="text-red-600">{featuredError}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                to={`/listings/${product.id}`}
                className="card hover:shadow-md transition-shadow cursor-pointer block"
              >
                <img
                  src={product.imageUrl || 'https://placehold.co/300x200?text=No+Image'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary-600 mb-2">${product.price}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{product.category || 'Uncategorized'}</span>
                    <span>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                  {product.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                  )}
                </div>
              </Link>
            ))}
            {featuredProducts.length === 0 && (
              <div className="card text-center py-8 text-gray-600">
                No featured products available right now.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
