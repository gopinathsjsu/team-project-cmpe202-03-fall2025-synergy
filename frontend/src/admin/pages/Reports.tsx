import { useEffect, useMemo, useState } from 'react'
import { adminApi, type AdminReportRow } from '../services/api'
import type { ReportStatus } from '../services/mockData'
import { Trash2 } from 'lucide-react'

interface ReportRow {
  id: string
  productId: string
  productName: string
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
  productName: row.product_name ?? '—',
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
    } catch (err: unknown) {
      console.error('Failed to load reports:', err)
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      const message = error?.response?.data?.error || error?.message || 'Failed to load reports. Please try again.'
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

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return
    }

    try {
      await adminApi.deleteReport(Number(reportId))
      // Remove the deleted report from the list
      setItems(items.filter(item => item.id !== reportId))
    } catch (err: unknown) {
      console.error('Failed to delete report:', err)
      const error = err as { response?: { data?: { error?: string } }; message?: string }
      const message = error?.response?.data?.error || error?.message || 'Failed to delete report. Please try again.'
      alert(message)
    }
  }

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
                <th className="p-2 text-left">Product Name</th>
                <th className="p-2 text-left">Listing ID</th>
                <th className="p-2 text-left">Reason</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">{r.productId}</td>
                  <td className="p-2">{r.productName}</td>
                  <td className="p-2">{r.listingId}</td>
                  <td className="p-2">{r.reason}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">{r.createdAt}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteReport(r.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition-colors"
                      title="Delete report"
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
    </div>
  )
}


