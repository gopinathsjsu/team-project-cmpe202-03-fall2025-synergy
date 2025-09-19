import { useState } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([{"from":"system","text":"Welcome to in-app chat (placeholder)."}])
  const [text, setText] = useState('')

  const send = () => {
    if (!text.trim()) return
    setMessages([...messages, { from: 'me', text }])
    setText('')
  }

  return (
    <div className="container">
      <h1>Chat</h1>
      <div className="card" style={{marginTop: '1rem'}}>
        <div style={{minHeight: '180px'}}>
          {messages.map((m, i) => (
            <div key={i} className="muted">[{m.from}] {m.text}</div>
          ))}
        </div>
        <div className="row" style={{marginTop: '0.75rem'}}>
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
          <button className="button" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  )
}


