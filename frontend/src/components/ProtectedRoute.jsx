import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  
  // Check if user is authenticated by checking for token in localStorage
  const token = localStorage.getItem('token');
  const isAuthenticated = token && localStorage.getItem('userAuth') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to login page, saving the current location they tried to access
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return children;
}
