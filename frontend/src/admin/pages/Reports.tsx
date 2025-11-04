import { getReports, setReports, type Report, type ReportStatus } from '../services/mockData'
import { useState } from 'react'

export default function Reports() {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL')
  const [items, setItems] = useState<Report[]>(getReports())

  const update = (id: string, status: ReportStatus) => {
    const next = items.map(r => (r.id === id ? { ...r, status } : r))
    setItems(next); setReports(next)
  }

  const list = items.filter(r => (statusFilter==='ALL'? true : r.status===statusFilter))

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Reports</h2>
        <select className="border rounded px-2 py-1" value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)}>
          <option value="ALL">All</option>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      <div className="bg-white border rounded">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Listing</th><th className="p-2 text-left">Reason</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
          <tbody>
            {list.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.listingId}</td>
                <td className="p-2">{r.reason}</td>
                <td className="p-2 text-center">{r.status}</td>
                <td className="p-2 space-x-2 text-center">
                  <button className="px-2 py-1 rounded bg-green-600 text-white" onClick={()=>update(r.id,'RESOLVED')}>Resolve</button>
                  <button className="px-2 py-1 rounded bg-yellow-600 text-white" onClick={()=>update(r.id,'REJECTED')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


