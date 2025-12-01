import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreateListingPage from './pages/CreateListingPage'
import EditListingPage from './pages/EditListingPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import ListingDetailsPage from './pages/ListingDetailsPage'
import ListingsPage from './pages/ListingsPage'
import Navbar from './components/Navbar'
import ChatbotWidget from './components/ChatbotWidget'
import AdminApp from './admin/App'
import ProtectedRoute from './components/ProtectedRoute'
import { ChatProvider } from './Provider/ChatProvider'

function InnerApp() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  
  // Track authentication status for chatbot visibility
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token')
    return token !== null && localStorage.getItem('userAuth') === 'true'
  })

  // Listen for login/logout events to update chatbot visibility
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('token')
      setIsAuthenticated(token !== null && localStorage.getItem('userAuth') === 'true')
    }

    // Listen for custom auth events
    window.addEventListener('userLogin', handleAuthChange)
    window.addEventListener('userLogout', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)

    return () => {
      window.removeEventListener('userLogin', handleAuthChange)
      window.removeEventListener('userLogout', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

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
            path="/listings/:id/edit" 
            element={
              <ProtectedRoute>
                <EditListingPage />
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
      
      {/* Show chatbot only when user is authenticated and not on admin pages */}
      {isAuthenticated && !isAdmin && <ChatbotWidget />}
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
