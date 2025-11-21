import { useMemo, useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productApi } from '../services/productApi'
import type { Product } from '../services/productApi'

// type Listing = {
//   id: number
//   title: string
//   price: number
//   image: string
//   category: string
//   seller: string
//   posted: string
// }

// const seed: Listing[] = [
//   { id: 1, title: 'Calculus Textbook - Stewart 8th', price: 45, image: 'https://placehold.co/300x200?text=Calculus%20Textbook', category: 'Textbooks', seller: 'John Doe', posted: '2h ago' },
//   { id: 2, title: 'MacBook Pro 13" (2020)', price: 1200, image: 'https://placehold.co/300x200?text=MacBook%20Pro', category: 'Electronics', seller: 'Jane Smith', posted: '1d ago' },
//   { id: 3, title: 'Gaming Chair - Ergonomic', price: 150, image: 'https://placehold.co/300x200?text=Gaming%20Chair', category: 'Furniture', seller: 'Mike', posted: '3d ago' },
//   { id: 4, title: 'Data Structures Textbook', price: 30, image: 'https://placehold.co/300x200?text=DS%20Textbook', category: 'Textbooks', seller: 'Sara', posted: '5h ago' },
//   { id: 5, title: 'Mechanical Keyboard', price: 80, image: 'https://placehold.co/300x200?text=Keyboard', category: 'Electronics', seller: 'Tom', posted: '6h ago' },
// ]

const categories = ['All', 'Textbooks', 'Electronics', 'Furniture', 'Gaming']

const ListingsPage = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch()
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId)
  }, [query])

  // Load products on mount
  useEffect(() => {
    performSearch()
  }, [])

  const performSearch = async () => {
    setLoading(true)
    setError('')
    try {
      let results: Product[]
      if (query.trim()) {
        // Use semantic search when there's a query
        results = await productApi.search(query.trim(), 50)
      } else {
        // Get all active products when no query
        results = await productApi.getActive()
      }
      setProducts(results)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load products')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category
      const minOk = minPrice ? Number(p.price) >= Number(minPrice) : true
      const maxOk = maxPrice ? Number(p.price) <= Number(maxPrice) : true
      return matchesCategory && minOk && maxOk
    })
  }, [products, category, minPrice, maxPrice])

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
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
              {categories.map((c) => (
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
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="lg:col-span-3">
          {error && (
            <div className="card bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {loading ? (
            <div className="card text-center py-16">
              <p className="text-gray-600">Searching...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-gray-600">No results. Try adjusting search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <Link key={p.id} to={`/listing/${p.id}`} className="card hover:shadow-md transition-shadow block">
                  <img 
                    src={p.imageUrl || 'https://placehold.co/300x200?text=No+Image'} 
                    alt={p.name} 
                    className="w-full h-48 object-cover rounded-lg mb-4" 
                  />
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
          )}
        </section>
      </div>
    </div>
  )
}

export default ListingsPage
