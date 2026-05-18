import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api'
import { ROLE_DASHBOARD } from '../utils/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  const persist = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password })
    persist(data.user, data.token)
    return data.user
  }

  const register = async (formData) => {
    const { data } = await authApi.register(formData)
    persist(data.user, data.token)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await authApi.me()
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const dashboardPath = user ? ROLE_DASHBOARD[user.role] : '/login'
  const hasAI = user?.plan === 'pro' || ['admin', 'doctor'].includes(user?.role)

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, dashboardPath, hasAI }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
