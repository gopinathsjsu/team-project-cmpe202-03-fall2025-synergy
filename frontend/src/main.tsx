import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MarketPlaceProvider } from './Provider/MarketPlaceProvider.tsx'
import { ChatProvider } from'./Provider/ChatProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MarketPlaceProvider>
      <ChatProvider>
      <App />
      </ChatProvider>
    </MarketPlaceProvider>
  </StrictMode>,
)
