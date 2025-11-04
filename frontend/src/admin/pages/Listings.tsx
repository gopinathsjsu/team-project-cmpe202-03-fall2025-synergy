import { getListings, setListings, type Listing, type ListingStatus } from '../services/mockData'
import { useState } from 'react'

export default function Listings() {
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'ALL'>('ALL')
  const [items, setItems] = useState<Listing[]>(getListings())

  const remove = (id: string) => {
    const next = items.map(l => l.id===id ? { ...l, status: 'REMOVED' } : l)
    setItems(next); setListings(next)
  }
  const list = items.filter(l => (statusFilter==='ALL'? true : l.status===statusFilter))

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Listings</h2>
        <select className="border rounded px-2 py-1" value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)}>
          <option value="ALL">All</option>
          <option value="ACTIVE">Active</option>
          <option value="SOLD">Sold</option>
          <option value="REMOVED">Removed</option>
        </select>
      </div>
      <div className="bg-white border rounded">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50"><th className="p-2 text-left">Title</th><th className="p-2 text-left">Seller</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
          <tbody>
            {list.map(l => (
              <tr key={l.id} className="border-t">
                <td className="p-2">{l.title}</td>
                <td className="p-2">{l.seller}</td>
                <td className="p-2 text-center">{l.status}</td>
                <td className="p-2 text-center">
                  <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={()=>remove(l.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


