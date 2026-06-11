import React, { createContext, useContext, useState, useEffect } from "react"
import { authService } from "@/services/authService"

interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  role: string
  institution?: string
  bio?: string
  profilePicture?: string
  savedEvents?: string[]
  registeredEvents?: string[]
  waitlistedEvents?: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: any) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const userData = await authService.me()
          setUser(userData)
        } catch (error) {
          console.error("Auth initialization failed:", error)
          localStorage.removeItem("token")
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = async (credentials: any) => {
    const data = await authService.login(credentials)
    setUser(data.user)
  }

  const register = async (userData: any) => {
    await authService.register(userData)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  // Re-fetches fresh user data from /auth/me — call after save/register actions
  const refreshUser = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const userData = await authService.me()
      setUser(userData)
    } catch (error) {
      console.error("Failed to refresh user:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
