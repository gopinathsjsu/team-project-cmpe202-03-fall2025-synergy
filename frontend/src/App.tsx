import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ShoppingBag, MessageCircle, User, Search } from 'lucide-react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreateListingPage from './pages/CreateListingPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import ListingDetailsPage from './pages/ListingDetailsPage'
import ListingsPage from './pages/ListingsPage'
import Navbar from './components/Navbar'
import AdminApp from './admin/App'

function InnerApp() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/listing/:id" element={<ListingDetailsPage />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <InnerApp />
    </Router>
  )
}

export default App
