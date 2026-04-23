import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  login  as authLogin,
  logout as authLogout,
  getCurrentUser,
  saveEvent        as apiSaveEvent,
  unsaveEvent      as apiUnsaveEvent,
  registerForEvent as apiRegisterForEvent,
  updateSubscriptions as apiUpdateSubscriptions,
} from '../services/authService'
import { USE_MOCK } from '../services/apiClient'
import { storageGet, storageSet } from '../utils/storage'

// Per-user prefs key (savedEvents, registeredEvents, subscriptions)
const prefsKey = (userId) => `user_prefs_${userId}`

/**
 * Write the mutable user preferences to localStorage so they survive
 * page reloads. The base user object (name, role, etc.) comes from the
 * auth service on every mount; only the user-owned lists are persisted here.
 */
function persistPrefs(user) {
  if (!user?.id) return
  storageSet(prefsKey(user.id), {
    savedEvents:      user.savedEvents      ?? [],
    registeredEvents: user.registeredEvents ?? [],
    subscriptions:    user.subscriptions    ?? [],
  })
}

// Safe default so useAuth() never returns null during HMR module reloads.
const AuthContext = createContext({
  user: null, loading: false, error: '',
  login: async () => {}, logout: () => {},
  toggleSavedEvent: () => {}, toggleSubscription: () => {},
  registerEvent: () => {}, unregisterEvent: () => {},
})

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)   // true while restoring session
  const [error,   setError]   = useState('')

  // ── Restore session on mount ────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    getCurrentUser()
      .then(restored => {
        if (!cancelled && restored) {
          // Merge persisted user preferences (saved/registered/subscriptions)
          // so they survive page reloads without a backend.
          const prefs = storageGet(prefsKey(restored.id))
          setUser(prefs ? { ...restored, ...prefs } : restored)
        }
      })
      .catch(() => {/* token invalid — stay logged out */})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  // ── Listen for 401 from anywhere in the app ─────────────────────
  useEffect(() => {
    const handle401 = () => { setUser(null); setError('') }
    window.addEventListener('auth:unauthorized', handle401)
    return () => window.removeEventListener('auth:unauthorized', handle401)
  }, [])

  // ── login(email, password) ──────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true)
    setError('')
    try {
      const { user: loggedInUser } = await authLogin(email, password)
      // Merge persisted prefs so e.g. saved events are still there after re-login
      const prefs = storageGet(prefsKey(loggedInUser.id))
      const userWithPrefs = prefs ? { ...loggedInUser, ...prefs } : loggedInUser
      setUser(userWithPrefs)
      return userWithPrefs           // caller can use the returned user if needed
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
      throw err                      // re-throw so LoginPage can handle it too
    } finally {
      setLoading(false)
    }
  }

  // ── logout ──────────────────────────────────────────────────────
  const logout = () => {
    authLogout()
    setUser(null)
    setError('')
  }

  // ── Saved events & subscriptions ────────────────────────────────
  // Local state is always updated optimistically for instant UI feedback.
  // When on the real backend (!USE_MOCK), the service call runs in parallel
  // to persist the change server-side; errors are silently swallowed here
  // because the optimistic update is the source of truth in this session.

  const toggleSavedEvent = (eventId) => {
    if (!user) return
    setUser(prev => {
      const isSaved = prev.savedEvents.includes(eventId)
      const next = {
        ...prev,
        savedEvents: isSaved
          ? prev.savedEvents.filter(id => id !== eventId)
          : [...prev.savedEvents, eventId],
      }
      persistPrefs(next)
      // Sync to backend when available
      if (!USE_MOCK) {
        const fn = isSaved ? apiUnsaveEvent : apiSaveEvent
        fn(eventId).catch(() => {/* optimistic — ignore transient errors */})
      }
      return next
    })
  }

  const toggleSubscription = (category) => {
    if (!user) return
    setUser(prev => {
      const next = {
        ...prev,
        subscriptions: prev.subscriptions.includes(category)
          ? prev.subscriptions.filter(c => c !== category)
          : [...prev.subscriptions, category],
      }
      persistPrefs(next)
      // Sync to backend when available — send the full updated list
      if (!USE_MOCK) {
        apiUpdateSubscriptions(next.subscriptions).catch(() => {})
      }
      return next
    })
  }

  /**
   * Register the current user for an event.
   * Idempotent — calling it twice has no effect.
   */
  const registerEvent = (eventId) => {
    if (!user) return
    setUser(prev => {
      const already = (prev.registeredEvents || []).includes(eventId)
      if (already) return prev
      const next = { ...prev, registeredEvents: [...(prev.registeredEvents || []), eventId] }
      persistPrefs(next)
      // Sync to backend when available
      if (!USE_MOCK) {
        apiRegisterForEvent(eventId).catch(() => {})
      }
      return next
    })
  }

  const unregisterEvent = (eventId) => {
    if (!user) return
    setUser(prev => {
      const next = {
        ...prev,
        registeredEvents: (prev.registeredEvents || []).filter(id => id !== eventId)
      }
      persistPrefs(next)
      // backend later: DELETE /registration
      return next
    })
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      error,
      toggleSavedEvent,
      toggleSubscription,
      registerEvent,
      unregisterEvent,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
