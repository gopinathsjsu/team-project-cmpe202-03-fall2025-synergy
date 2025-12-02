import React, { useMemo, useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Loader2, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { productApi } from '../services/productApi'
import type { Product } from '../services/productApi'
import Pagination from '../components/Pagination'

const ListingsPage = () => {
  // Filter state
  const [query, setQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const paramCategory = searchParams.get('category') ?? 'All'
  const [category, setCategory] = useState(paramCategory)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  
  // Data state
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // Fetch all products on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true)
      setError('')
      console.log('[ListingsPage] Fetching all products...')
      try {
        const products = await productApi.getAll()
        console.log('[ListingsPage] Received products:', products.length)
        // Debug: Log image URLs to see what we're getting
        products.forEach((p, idx) => {
          // if (idx < 3) { // Log first 3 products for debugging
          //   // console.log(`[ListingsPage] Product ${p.id} (${p.name}): imageUrl =`, p.imageUrl || 'NULL/EMPTY')
          // }
        })
        setAllProducts(products)
      } catch (err: unknown) {
        console.error('[ListingsPage] Error fetching products:', err)
        const error = err as { 
          response?: { 
            status?: number
            data?: { 
              error?: string
              message?: string
            }
          }
          message?: string
          code?: string
        }
        
        let errorMessage = 'Failed to load products'
        
        if (error.response) {
          const status = error.response?.status
          const data = error.response?.data
          
          if (status === 500) {
            // Server error - likely database issue
            if (data?.message?.includes('updated_at') || data?.message?.includes('column')) {
              errorMessage = 'Database configuration error. Please contact the administrator or run the database migration.'
            } else {
              errorMessage = 'Server error occurred. Please try again later or contact support.'
            }
          } else if (status === 404) {
            errorMessage = 'Products endpoint not found. Please check the API configuration.'
          } else if (status === 401 || status === 403) {
            errorMessage = 'Authentication required. Please log in.'
          } else {
            errorMessage = data?.error || data?.message || error.message || errorMessage
          }
        } else if (error.message) {
          errorMessage = error.message
        } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
          errorMessage = 'Unable to connect to server. Please check if the backend is running on port 8080.'
        }
        
        setError(errorMessage)
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllProducts()
  }, [])

  // Client-side filtering: category, price range, and keyword search
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      return []
    }
    
    return allProducts.filter((p) => {
      if (!p) return false
      
      // Exclude sold items from main listings page
      const status = p.status?.toUpperCase() || ''
      if (status === 'SOLD') {
        return false
      }
      
      // Category filter
      const matchesCategory = category === 'All' || p.category === category
      
      // Price range filter
      const price = Number(p.price) || 0
      const minOk = minPrice ? price >= Number(minPrice) : true
      const maxOk = maxPrice ? price <= Number(maxPrice) : true
      
      // Keyword search (name or description)
      const searchTerm = query.toLowerCase().trim()
      const matchesSearch = !searchTerm || 
        (p.name?.toLowerCase().includes(searchTerm) || 
         p.description?.toLowerCase().includes(searchTerm))
      
      return matchesCategory && minOk && maxOk && matchesSearch
    })
  }, [allProducts, category, minPrice, maxPrice, query])

  // Get unique categories from products for dropdown
  const availableCategories = useMemo(() => {
    const categories = new Set<string>(['All'])
    if (Array.isArray(allProducts)) {
      allProducts.forEach(p => {
        if (p && p.category) categories.add(p.category)
      })
    }
    return Array.from(categories).sort()
  }, [allProducts])

  // Client-side pagination
  const totalElements = filteredProducts.length || 0
  const totalPages = totalElements > 0 ? Math.max(1, Math.ceil(totalElements / pageSize)) : 0
  const startIndex = Math.max(0, currentPage * pageSize)
  const endIndex = Math.min(startIndex + pageSize, totalElements)
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
  // console.log(paginatedProducts)

  useEffect(() => {
    setCategory(paramCategory)
  }, [paramCategory])

  const updateCategoryParam = (value: string) => {
    setCategory(value)
    if (value === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ category: value })
    }
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0)
  }, [category, minPrice, maxPrice, query, pageSize])
  
  // Ensure currentPage is valid when totalPages changes
  useEffect(() => {
    if (totalPages > 0 && currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1))
    } else if (totalPages === 0) {
      setCurrentPage(0)
    }
  }, [totalPages])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(0)
  }

  const hasActiveFilters = query || category !== 'All' || minPrice || maxPrice

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Listings</h1>
        <p className="text-gray-600">Discover great deals on Spartan Exchange</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* Enhanced Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card sticky top-4 shadow-lg border border-gray-200">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setQuery('')
                    setCategory('All')
                    setMinPrice('')
                    setMaxPrice('')
                    updateCategoryParam('All')
                  }}
                  className="text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Search Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    placeholder="Search by name or description..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder:text-gray-400 shadow-sm"
                  />
                  {query && (
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        setQuery('')
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Category
                  </label>
                  {category !== 'All' && (
                    <button
                      onClick={() => updateCategoryParam('All')}
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <select 
                  value={category} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateCategoryParam(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-gray-900 cursor-pointer shadow-sm font-medium"
                >
                  {availableCategories.map((c: string) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Min $"
                      value={minPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPrice(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder:text-gray-400 shadow-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max $"
                      value={maxPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPrice(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder:text-gray-400 shadow-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                {(minPrice || maxPrice) && (
                  <button
                    onClick={() => {
                      setMinPrice('')
                      setMaxPrice('')
                    }}
                    className="mt-2 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
                  >
                    Clear price filter
                  </button>
                )}
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Active Filters
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {query && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Search: "{query}"
                        </span>
                      )}
                      {category !== 'All' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {category}
                        </span>
                      )}
                      {minPrice && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Min: ${minPrice}
                        </span>
                      )}
                      {maxPrice && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Max: ${maxPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="lg:col-span-3">
          {error && (
            <div className="card bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-lg mb-6">
              <p className="font-semibold mb-1.5">Error Loading Products</p>
              <p className="text-sm mb-3">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setError('')
                    setLoading(true)
                    productApi.getAll()
                      .then(products => {
                        setAllProducts(Array.isArray(products) ? products : [])
                        setError('')
                      })
                      .catch(err => {
                        console.error('Retry failed:', err)
                        let errorMessage = 'Failed to load products'
                        if (err.response?.data?.error) {
                          errorMessage = err.response.data.error
                        } else if (err.message) {
                          errorMessage = err.message
                        } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
                          errorMessage = 'Unable to connect to server. Please check if the backend is running.'
                        }
                        setError(errorMessage)
                      })
                      .finally(() => setLoading(false))
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Retry
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  Reload Page
                </button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="card text-center py-16">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600 mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-gray-600">
                {allProducts.length === 0 
                  ? 'No products found in the database.'
                  : `No products match your filters. (${totalElements} total products)`}
              </p>
              {allProducts.length > 0 && (
                <button
                  onClick={() => {
                    setQuery('')
                    setCategory('All')
                    setMinPrice('')
                    setMaxPrice('')
                    updateCategoryParam('All')
                  }}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-base text-gray-700">
                    <span className="font-bold text-gray-900 text-lg">
                      {totalElements}
                    </span>
                    {' '}product{totalElements !== 1 ? 's' : ''} found
                    {query && (
                      <span className="ml-2">
                        matching <span className="font-semibold text-primary-600">"{query}"</span>
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-1.5">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalElements)} of {totalElements}
                  </p>
                </div>
              </div>
              
              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((p: Product) => (
                  <Link 
                    key={p.id} 
                    to={`/listings/${p.id}`} 
                    className="group card hover:shadow-xl transition-all duration-300 block border border-gray-200 hover:border-primary-300 overflow-hidden"
                  >
                    {/* Image Container */}
                    <div className="rrelative h-56 bg-gray-100 flex items-center justify-center overflow-hidden bg-gray-100">
                      <img 
                        src={p.imageUrl ? p.imageUrl : "/placeholder.png"} 
                        alt={p.name || 'Product'} 
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png'
                        }}
                        onLoad={() => {
                          if (p.imageUrl) {
                            // console.log(`[ListingsPage] Successfully loaded image for product ${p.id}:`, p.imageUrl)
                          }
                        }}
                      />
                      {/* Status Badge */}
                      {p.status && (
                        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md ${
                          p.status === 'ACTIVE' || p.status === 'active'
                            ? 'bg-green-500 text-white'
                            : p.status === 'SOLD' || p.status === 'sold'
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-500 text-white'
                        }`}>
                          {p.status}
                        </div>
                      )}
                      {/* Match Percentage Badge */}
                      {p.matchPercentage !== undefined && p.matchPercentage !== null && query.trim() && (
                        <div className="absolute top-3 right-3 bg-primary-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
                          {p.matchPercentage.toFixed(0)}% match
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg group-hover:text-primary-600 transition-colors">
                        {p.name || 'Unnamed Product'}
                      </h3>
                      
                      <div className="flex items-baseline justify-between mb-3">
                        <p className="text-3xl font-bold text-primary-600">${p.price || 0}</p>
                        {p.condition && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded font-medium">
                            {p.condition}
                          </span>
                        )}
                      </div>
                      
                      {p.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {p.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded">
                          {p.category || 'Uncategorized'}
                        </span>
                        {p.createdAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(p.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    totalElements={totalElements}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default ListingsPage
