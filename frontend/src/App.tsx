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
import ProtectedRoute from './components/ProtectedRoute'

function InnerApp() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/listings" 
            element={
              <ProtectedRoute>
                <ListingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-listing" 
            element={
              <ProtectedRoute>
                <CreateListingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/listing/:id" 
            element={
              <ProtectedRoute>
                <ListingDetailsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
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
