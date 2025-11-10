import { useEffect, useState } from 'react'
import { metrics } from '../services/mockData'
import { adminApi } from '../services/api'

export default function Dashboard() {
  const [userCounts, setUserCounts] = useState({ total: 0, active: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setLoading(true)
        const counts = await adminApi.getUserCount()
        setUserCounts(counts)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch user count:', err)
        setError('Failed to load user count')
        // Fallback to mock data on error
        const m = metrics()
        setUserCounts({ total: m.totalUsers, active: m.activeUsers })
      } finally {
        setLoading(false)
      }
    }

    fetchUserCount()
  }, [])

  const m = metrics()
  const cards = [
    { label: 'Total Users', value: loading ? '...' : userCounts.total },
    { label: 'Active Users', value: loading ? '...' : userCounts.active },
    { label: 'Total Listings', value: m.totalListings },
    { label: 'Open Reports', value: m.openReports },
  ]
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Overview</h2>
      {error && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
          {error} - Showing fallback data
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


