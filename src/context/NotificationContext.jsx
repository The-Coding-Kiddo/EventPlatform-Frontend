import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createNotification,
} from '../services/notificationService'
import { USE_MOCK } from '../services/apiClient'
import { storageGet, storageSet } from '../utils/storage'
import { useAuth } from './AuthContext'

const NotificationContext = createContext({
  notifications: [],
  addNotification: async () => {},
  markRead: async () => {},
  markAllRead: async () => {},
  getNotificationsForUser: () => [],
  unreadCount: 0,
})

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  // Seed from localStorage if present; otherwise fetch from service on mount.
  const [notifications, setNotifications] = useState(() => storageGet('notifications') ?? [])

  // ── Load on mount — only if nothing is in localStorage yet ──────
  useEffect(() => {
    if (USE_MOCK && storageGet('notifications') !== null) return   // already restored
    fetchNotifications()
      .then(data => setNotifications(data))
      .catch(() => {/* silently fail — notifications are non-critical */})
  }, [])

  // ── Persist whenever notifications change ───────────────────────
  useEffect(() => { 
    if (USE_MOCK) storageSet('notifications', notifications) 
  }, [notifications])

  /**
   * Add a new notification (called internally from EventContext after moderation).
   * Persists via service, then prepends to local state.
   */
  const addNotification = useCallback(async (notif) => {
    try {
      const created = await createNotification(notif)
      setNotifications(prev => [created, ...prev])
    } catch {
      // Fallback: add locally only if service call fails
      setNotifications(prev => [{
        id: Date.now(),
        read: false,
        time: 'Just now',
        ...notif,
      }, ...prev])
    }
  }, [])

  /** Mark a single notification as read. */
  const markRead = useCallback(async (id) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    try {
      await markNotificationRead(id)
    } catch {
      // Roll back on error
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n))
    }
  }, [])

  /** Mark all notifications as read. */
  const markAllRead = useCallback(async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    try {
      await markAllNotificationsRead()
    } catch {
      // Roll back on error — re-fetch the true state
      fetchNotifications().then(data => setNotifications(data)).catch(() => {})
    }
  }, [])

  /**
   * Return notifications visible to a given user.
   * Rules:
   *   - No forRole set → show to everyone
   *   - forRole === 'citizen' → only if forCategory matches a user subscription (or unset)
   *   - forRole === 'institution_admin' → only if forInstitution matches (or unset)
   */
  const getNotificationsForUser = useCallback((u) => {
    if (!u) return []
    return notifications.filter(n => {
      if (!n.forRole) return true
      if (n.forRole !== u.role) return false
      if (n.forRole === 'institution_admin') {
        return !n.forInstitution || n.forInstitution === u.institution
      }
      if (n.forRole === 'citizen') {
        return !n.forCategory || u.subscriptions?.includes(n.forCategory)
      }
      return true
    })
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    return getNotificationsForUser(user)
  }, [getNotificationsForUser, user])

  const unreadCount = filteredNotifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      notifications: filteredNotifications,
      addNotification,
      markRead,
      markAllRead,
      getNotificationsForUser,
      unreadCount,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
