import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')

  return (
    <div className="container">
      <header className="header">
        <h1>Synergy</h1>
        <p>A basic React page scaffolded with Vite.</p>
      </header>

      <section className="card">
        <h2>Say hello</h2>
        <div className="row">
          <input
            className="input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="button" onClick={() => alert(`Hello, ${name || 'there'}!`)}>
            Greet
          </button>
        </div>
        {name && <p className="muted">Nice to meet you, {name}.</p>}
      </section>

      <footer className="footer">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">Powered by Vite</a>
        <span> · </span>
        <a href="https://react.dev" target="_blank" rel="noreferrer">Built with React</a>
      </footer>
    </div>
  )
}

export default App
