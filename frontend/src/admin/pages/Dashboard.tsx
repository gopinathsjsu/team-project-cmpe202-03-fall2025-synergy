import { metrics } from '../services/mockData'

export default function Dashboard() {
  const m = metrics()
  const cards = [
    { label: 'Total Users', value: m.totalUsers },
    { label: 'Active Users', value: m.activeUsers },
    { label: 'Total Listings', value: m.totalListings },
    { label: 'Open Reports', value: m.openReports },
  ]
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Overview</h2>
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


