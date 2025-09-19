import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export default function CreateListing() {
  const [form, setForm] = useState({ title: '', description: '', category: '', price: '' })
  const [message, setMessage] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category || 'general',
          price: Number(form.price || 0),
        })
      })
      if (!res.ok) throw new Error('Failed to create listing')
      setMessage('Listing created!')
      setForm({ title: '', description: '', category: '', price: '' })
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="container">
      <h1>Create Listing</h1>
      <form className="card" onSubmit={onSubmit} style={{marginTop: '1rem', display: 'grid', gap: '0.75rem'}}>
        <input className="input" name="title" placeholder="Title" value={form.title} onChange={onChange} required />
        <input className="input" name="category" placeholder="Category" value={form.category} onChange={onChange} />
        <input className="input" name="price" placeholder="Price" type="number" step="0.01" value={form.price} onChange={onChange} />
        <textarea className="input" name="description" placeholder="Description" value={form.description} onChange={onChange} />
        <button className="button" type="submit">Save</button>
        {message && <p className="muted">{message}</p>}
      </form>
    </div>
  )
}


