import { useMemo, useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react'
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
        setAllProducts(products)
      } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };
        const errorMessage = error.response?.data?.error || error.message || 'Failed to load products'
        console.error('[ListingsPage] Error fetching products:', err)
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
    return allProducts.filter((p) => {
      // Category filter
      const matchesCategory = category === 'All' || p.category === category
      
      // Price range filter
      const price = Number(p.price)
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
    allProducts.forEach(p => {
      if (p.category) categories.add(p.category)
    })
    return Array.from(categories).sort()
  }, [allProducts])

  // Client-side pagination
  const totalElements = filteredProducts.length
  const totalPages = Math.ceil(totalElements / pageSize)
  const startIndex = currentPage * pageSize
  const endIndex = startIndex + pageSize
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Listings</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <SlidersHorizontal className="h-5 w-5" />
          <span className="text-sm">Search & Filters</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Filters */}
        <aside className="card lg:col-span-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items..."
                className="input-field pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Search by name or description
            </p>
          </div>

            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
              Category
              <button
                onClick={() => updateCategoryParam('All')}
                className="text-xs text-primary-600 hover:text-primary-800"
              >
                All
              </button>
            </label>
            <select 
              value={category} 
              onChange={(e) => updateCategoryParam(e.target.value)} 
              className="input-field"
            >
              {availableCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range ($)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input-field"
                min="0"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="lg:col-span-3">
          {error && (
            <div className="card bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-semibold mb-1">Error</p>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Retry
              </button>
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
                  }}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, totalElements)} of {totalElements} products
                {query && ` matching "${query}"`}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((p) => (
                  <Link key={p.id} to={`/listing/${p.id}`} className="card hover:shadow-md transition-shadow block">
                    <div className="relative">
                      <img 
                        src={p.imageUrl || 'https://placehold.co/300x200?text=No+Image'} 
                        alt={p.name} 
                        className="w-full h-48 object-cover rounded-lg mb-4" 
                      />
                      {p.matchPercentage !== undefined && p.matchPercentage !== null && query.trim() && (
                        <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                          {p.matchPercentage.toFixed(1)}% match
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{p.name}</h3>
                    <p className="text-2xl font-bold text-primary-600">${p.price}</p>
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{p.category || 'Uncategorized'}</span>
                      {p.condition && <span>{p.condition}</span>}
                    </div>
                    {p.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.description}</p>
                    )}
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                  totalElements={totalElements}
                />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default ListingsPage
