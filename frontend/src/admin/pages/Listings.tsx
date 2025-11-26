import { useEffect, useMemo, useState } from 'react'
import { adminApi, type AdminListingRow } from '../services/api'

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
  return {
    id: row.id.toString(),
    product: row.product_name ?? `Listing ${row.id}`,
    category: row.category ?? '—',
    condition: row.cond ?? '—',
    price: Number.isFinite(priceValue) ? `$${priceValue.toFixed(2)}` : '—',
    sellerId: row.create_audit_id ? String(row.create_audit_id) : '—',
    createdAt: row.create_audit_time ? new Date(row.create_audit_time as string).toLocaleString() : '—',
  }
}

export default function Listings() {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [items, setItems] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}


