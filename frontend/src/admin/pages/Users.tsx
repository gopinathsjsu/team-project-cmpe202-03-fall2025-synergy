import { getUsers, setUsers, type User, type UserStatus } from '../services/mockData'
import { useState } from 'react'

export default function Users() {
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL')
  const [items, setItems] = useState<User[]>(getUsers())

  const toggle = (id: string) => {
    const next = items.map(u => u.id===id ? { ...u, status: u.status==='ACTIVE'?'SUSPENDED':'ACTIVE' } : u)
    setItems(next); setUsers(next)
  }
  const list = items.filter(u => (statusFilter==='ALL'? true : u.status===statusFilter))

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Users</h2>
        <select className="border rounded px-2 py-1" value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)}>
          <option value="ALL">All</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>
      <div className="bg-white border rounded">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50"><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
          <tbody>
            {list.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2 text-center">{u.status}</td>
                <td className="p-2 text-center">
                  <button className={`px-2 py-1 rounded ${u.status==='ACTIVE'?'bg-red-600':'bg-green-600'} text-white`} onClick={()=>toggle(u.id)}>
                    {u.status==='ACTIVE'?'Suspend':'Restore'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


