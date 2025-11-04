import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  const items = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/reports', label: 'Reports' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/listings', label: 'Listings' },
  ]
  return (
    <aside className="w-56 border-r bg-white h-screen sticky top-0 p-4">
      <h2 className="font-semibold mb-4">Admin</h2>
      <nav className="flex flex-col gap-1">
        {items.map(i => (
          <Link key={i.to} to={i.to} className={`px-3 py-2 rounded ${location.pathname===i.to?'bg-blue-600 text-white':'hover:bg-blue-50'}`}>{i.label}</Link>
        ))}
        <Link to="/login" className="px-3 py-2 rounded mt-2 text-red-700 hover:bg-red-50">Logout</Link>
      </nav>
    </aside>
  )
}


