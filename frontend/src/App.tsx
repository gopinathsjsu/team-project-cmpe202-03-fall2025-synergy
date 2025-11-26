import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom'
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
import { ChatProvider } from './Provider/ChatProvider'

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
          <Route path="/listings" element={<ListingsPage />} />
          
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
            path="/listings/:id" 
            element={<ListingDetailsPage />} 
          />
          {/* Legacy route for backward compatibility */}
          <Route 
            path="/listing/:id" 
            element={<ListingDetailsPage />} 
          />
          
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminApp />} />
          
          {/* 404 - Catch all route */}
          <Route 
            path="*" 
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <Link 
                  to="/" 
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Go to Home
                </Link>
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <ChatProvider>
        <InnerApp />
      </ChatProvider>
    </Router>
  )
}

export default App
