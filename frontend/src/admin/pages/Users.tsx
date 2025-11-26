import { useEffect, useState } from 'react'
import { adminApi, type AdminUserRow } from '../services/api'
import type { UserStatus } from '../services/mockData'

// Frontend User interface for display
interface User {
  id: string
  name: string
  email: string
  status: UserStatus
}

// Helper function to map backend user to frontend user
const normalizeStatus = (status?: string | null): UserStatus => {
  const value = (status ?? 'ACTIVE').toUpperCase()
  return value === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE'
}

const mapBackendUserToFrontend = (backendUser: AdminUserRow): User => {
  const fullName = [backendUser.first_name, backendUser.last_name]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(' ')
    .trim()

  const fallbackName = backendUser.username || backendUser.email || `User ${backendUser.id}`

  return {
    id: backendUser.id.toString(),
    name: fullName || fallbackName,
    email: backendUser.email ?? '—',
    status: normalizeStatus(backendUser.status),
  }
}

export default function Users() {
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL')
  const [items, setItems] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      const backendUsers = await adminApi.getUserList()
      const mappedUsers = backendUsers.map(mapBackendUserToFrontend)
      setItems(mappedUsers)
    } catch (err: unknown) {
      console.error('Failed to fetch users:', err)
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      const message = error?.response?.data?.error || error?.message || 'Failed to load users. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Toggle user status (suspend/restore)
  const toggle = async (id: string) => {
    const user = items.find(u => u.id === id)
    if (!user) return

    const newStatus: 'ACTIVE' | 'SUSPENDED' = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    const action = newStatus === 'SUSPENDED' ? 'suspended' : 'restored'
    
    // Add to updating set
    setUpdatingIds(prev => new Set(prev).add(id))
    setError(null)
    setSuccess(null)
    
    try {
      await adminApi.updateUserStatus(parseInt(id), newStatus)
      setSuccess(`User ${action} successfully!`)
      // Refresh the list after successful update
      await fetchUsers()
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: unknown) {
      console.error('Failed to update user status:', err)
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      const errorMessage = error?.response?.data?.error || 
                          error?.message || 
                          'Failed to update user status. Please try again.'
      setError(errorMessage)
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      // Remove from updating set
      setUpdatingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const list = items.filter(u => (statusFilter === 'ALL' ? true : u.status === statusFilter))

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <select
            className="border rounded px-2 py-1"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'SUSPENDED')}
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm flex items-center justify-between">
          <span>{success}</span>
          <button
            onClick={() => setSuccess(null)}
            className="ml-2 text-green-700 hover:text-green-900"
          >
            ×
          </button>
        </div>
      )}

      <div className="bg-white border rounded">
        {loading && items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No users found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        u.status === 'ACTIVE' 
                          ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' 
                          : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                      } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={() => toggle(u.id)}
                      disabled={loading || updatingIds.has(u.id)}
                    >
                      {updatingIds.has(u.id) ? (
                        <span className="flex items-center gap-1">
                          <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Updating...
                        </span>
                      ) : (
                        u.status === 'ACTIVE' ? 'Suspend' : 'Restore'
                      )}
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


