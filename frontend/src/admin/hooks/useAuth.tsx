import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  adminEmail: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('adminAuth') === 'true')
  const [adminEmail, setAdminEmail] = useState<string | null>(() => localStorage.getItem('adminEmail'))

  const login = (email: string, password: string): boolean => {
    if (email === 'admin@campusmarket.com' && password === 'admin123') {
      setIsAuthenticated(true)
      setAdminEmail(email)
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminEmail', email)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setAdminEmail(null)
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminEmail')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, adminEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}


