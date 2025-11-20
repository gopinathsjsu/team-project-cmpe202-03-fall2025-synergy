import { useEffect, useMemo, useState } from 'react'
import { adminApi, type AdminReportRow } from '../services/api'
import type { ReportStatus } from '../services/mockData'

interface ReportRow {
  id: string
  productId: string
  listingId: string
  reason: string
  status: ReportStatus
  createdAt: string
}

const normalizeStatus = (status?: string | null): ReportStatus => {
  const value = (status ?? 'OPEN').toUpperCase()
  if (value === 'RESOLVED' || value === 'REJECTED') return value
  return 'OPEN'
}

const mapReport = (row: AdminReportRow): ReportRow => ({
  id: row.id.toString(),
  productId: row.product_id != null ? row.product_id.toString() : '—',
  listingId: row.listing_id != null ? row.listing_id.toString() : '—',
  reason: row.reason ?? '—',
  status: normalizeStatus(row.status),
  createdAt: row.create_audit_time ? new Date(row.create_audit_time as string).toLocaleString() : '—',
})

export default function Reports() {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL')
  const [items, setItems] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.getReports()
      setItems(data.map(mapReport))
    } catch (err: any) {
      console.error('Failed to load reports:', err)
      const message = err?.response?.data?.error || err?.message || 'Failed to load reports. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReports() }, [])

  const statuses = useMemo(() => {
    const set = new Set<ReportStatus>()
    items.forEach(item => set.add(item.status))
    return Array.from(set).sort()
  }, [items])

  const list = items.filter(r => (statusFilter === 'ALL' ? true : r.status === statusFilter))

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Reports</h2>
        <select
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as ReportStatus | 'ALL')}
        >
          <option value="ALL">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      <div className="bg-white border rounded">
        {error ? (
          <div className="p-4 text-red-700">{error}</div>
        ) : loading ? (
          <div className="p-4 text-gray-600">Loading reports...</div>
        ) : list.length === 0 ? (
          <div className="p-4 text-gray-600">No reports found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Report</th>
                <th className="p-2 text-left">Product ID</th>
                <th className="p-2 text-left">Listing ID</th>
                <th className="p-2 text-left">Reason</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">{r.productId}</td>
                  <td className="p-2">{r.listingId}</td>
                  <td className="p-2">{r.reason}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}


