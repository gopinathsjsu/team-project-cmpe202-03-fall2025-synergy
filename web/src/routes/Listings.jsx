import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export default function Listings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/api/listings`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch listings')
        return r.json()
      })
      .then(setListings)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container"><p>Loading...</p></div>
  if (error) return <div className="container"><p>Error: {error}</p></div>

  return (
    <div className="container">
      <h1>Listings</h1>
      <div className="card" style={{marginTop: '1rem'}}>
        {listings.length === 0 ? (
          <p className="muted">No listings yet.</p>
        ) : (
          <ul>
            {listings.map(l => (
              <li key={l.id}>
                <strong>{l.title}</strong> — ${l.price} {l.sold ? '(Sold)' : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}


