import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, MessageCircle, User, Search, Plus, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const userAuth = localStorage.getItem('userAuth')
      const user = localStorage.getItem('username')
      
      setIsAuthenticated(!!(token && userAuth === 'true'))
      setUsername(user)
    }
    
    // Check on mount
    checkAuth()
    
    // Listen for custom logout event (for same-tab updates)
    const handleLogoutEvent = () => {
      checkAuth()
    }
    
    window.addEventListener('userLogout', handleLogoutEvent)
    window.addEventListener('userLogin', handleLogoutEvent)
    
    // Listen for storage changes (for cross-tab updates)
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('userLogout', handleLogoutEvent)
      window.removeEventListener('userLogin', handleLogoutEvent)
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  const handleLogout = () => {
    // Clear all auth-related localStorage items
    localStorage.removeItem('token')
    localStorage.removeItem('userAuth')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('firstName')
    localStorage.removeItem('lastName')
    
    // Update state
    setIsAuthenticated(false)
    setUsername(null)
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('userLogout'))
    
    // Redirect to login page
    navigate('/login', { replace: true })
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Spartan Exchange</span>
          </Link>

          {/* Search Bar */}
          {/* <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for textbooks, gadgets, essentials..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div> */}

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/listings"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <span>Browse</span>
                </Link>
                <Link
                  to="/create-listing"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Sell</span>
                </Link>
                
                <Link
                  to="/chat"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{username || 'Profile'}</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors border border-gray-300 rounded-lg hover:border-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
