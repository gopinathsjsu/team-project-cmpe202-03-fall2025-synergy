import { useEffect, useState } from 'react'
import { adminApi } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalListings: 0, openReports: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const result = await adminApi.getAdminStats()
        setStats(result)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch admin stats:', err)
        const message = err?.response?.data?.error || 'Failed to load stats. Please try again.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Users', value: loading ? '...' : stats.totalUsers },
    { label: 'Active Users', value: loading ? '...' : stats.activeUsers },
    { label: 'Total Listings', value: loading ? '...' : stats.totalListings },
    { label: 'Open Reports', value: loading ? '...' : stats.openReports },
  ]
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Overview</h2>
      {error && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white border rounded p-4">
            <div className="text-sm text-gray-600">{c.label}</div>
            <div className="text-2xl font-bold">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


