import { useEffect, useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { adminApi, type AdminListingRow } from '../services/api'
import { Toast } from '../../components/Toast'

interface Listing {
  id: string
  product: string
  category: string
  condition: string
  price: string
  sellerId: string
  createdAt: string
}

const mapListing = (row: AdminListingRow): Listing => {
  const priceValue = typeof row.price === 'number' ? row.price : Number(row.price)
  // Product name can be in 'name' or 'product_name' column
  const productName = row.name ?? row.product_name ?? `Listing ${row.id}`
  // Condition can be in 'condition' (direct column) or 'cond' (join alias)
  const condition = row.condition ?? row.cond ?? '—'
  // Seller ID from seller_id column
  const sellerId = row.seller_id != null ? String(row.seller_id) : '—'
  // Created timestamp from created_at column
  const createdAt = row.created_at ? new Date(row.created_at as string).toLocaleString() : '—'
  
  return {
    id: row.id.toString(),
    product: productName,
    category: row.category ?? '—',
    condition: condition,
    price: Number.isFinite(priceValue) ? `$${priceValue.toFixed(2)}` : '—',
    sellerId: sellerId,
    createdAt: createdAt,
  }
}

export default function Listings() {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [items, setItems] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type?: 'error' | 'success' | 'info' } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; product: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchListings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.getListings()
      setItems(data.map(mapListing))
    } catch (err: unknown) {
      console.error('Failed to load listings:', err)
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      const message = error?.response?.data?.error || error?.message || 'Failed to load listings. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchListings() }, [])

  const categories = useMemo(() => {
    const unique = new Set<string>()
    items.forEach(item => {
      if (item.category && item.category !== '—') unique.add(item.category)
    })
    return Array.from(unique).sort()
  }, [items])

  const list = items.filter(l => (categoryFilter === 'ALL' ? true : l.category === categoryFilter))

  const handleDeleteClick = (listing: Listing) => {
    setDeleteConfirm({ id: listing.id, product: listing.product })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return

    const listingId = parseInt(deleteConfirm.id, 10)
    if (isNaN(listingId)) {
      setToast({ message: 'Invalid listing ID', type: 'error' })
      setDeleteConfirm(null)
      return
    }

    try {
      setDeleting(true)
      await adminApi.deleteListing(listingId)
      
      // Remove from UI immediately
      setItems(prev => prev.filter(item => item.id !== deleteConfirm.id))
      setToast({ message: 'Listing deleted successfully', type: 'success' })
      setDeleteConfirm(null)
    } catch (err: unknown) {
      console.error('Failed to delete listing:', err)
      const error = err as { response?: { data?: { error?: string } }; message?: string }
      const message = error?.response?.data?.error || error?.message || 'Failed to delete listing. Please try again.'
      setToast({ message, type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Listings</h2>
        <select
          className="border rounded px-2 py-1"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="bg-white border rounded">
        {error ? (
          <div className="p-4 text-red-700">{error}</div>
        ) : loading ? (
          <div className="p-4 text-gray-600">Loading listings...</div>
        ) : list.length === 0 ? (
          <div className="p-4 text-gray-600">No listings found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Condition</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-left">Seller ID</th>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(l => (
                <tr key={l.id} className="border-t">
                  <td className="p-2">{l.product}</td>
                  <td className="p-2">{l.category}</td>
                  <td className="p-2">{l.condition}</td>
                  <td className="p-2 text-right font-medium">{l.price}</td>
                  <td className="p-2">{l.sellerId}</td>
                  <td className="p-2">{l.createdAt}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDeleteClick(l)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Listing</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>"{deleteConfirm.product}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
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


