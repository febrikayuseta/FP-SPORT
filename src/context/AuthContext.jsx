import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'
import { getToken, setToken, setUnauthorizedHandler } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(true)

  const loadMe = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      return null
    }
    try {
      const res = await authApi.me()
      const u = res?.data || null
      setUser(u)
      return u
    } catch {
      setToken(null)
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))
    loadMe().finally(() => setBooting(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login(email, password) {
    const res = await authApi.login({ email, password })
    const token = res?.data?.token
    if (!token) throw new Error('Login berhasil tapi token nggak ditemukan di response.')
    setToken(token)
    const u = res?.data?.user || (await loadMe())
    setUser(u)
    return u
  }

  async function register(payload) {
    const res = await authApi.register(payload)
    const token = res?.data?.token
    if (token) {
      setToken(token)
      const u = res?.data?.user || (await loadMe())
      setUser(u)
    }
    return res
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // ignore — tetep clear sesi lokal walau request gagal
    }
    setToken(null)
    setUser(null)
  }

  async function updateProfile(payload) {
    if (!user) throw new Error('Belum login')
    const res = await authApi.updateUser(user.id, payload)
    await loadMe()
    return res
  }

  const value = {
    user,
    booting,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    refresh: loadMe,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
