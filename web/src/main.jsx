import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import Listings from './routes/Listings.jsx'
import CreateListing from './routes/CreateListing.jsx'
import Admin from './routes/Admin.jsx'
import Chat from './routes/Chat.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/listings', element: <Listings /> },
  { path: '/listings/new', element: <CreateListing /> },
  { path: '/admin', element: <Admin /> },
  { path: '/chat', element: <Chat /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
