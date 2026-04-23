/**
 * notificationService.js
 *
 * Notification fetch and mutation operations.
 * - Mock mode: operates on an in-memory store seeded from mockNotifications.
 * - Backend mode: calls the notification REST endpoints.
 *
 * The backend is expected to scope notifications to the authenticated user
 * via the Authorization header (handled automatically by apiClient).
 */

import { api, USE_MOCK } from './apiClient'
import { mockNotifications } from '../data/mockData'

// ── In-memory mock store ───────────────────────────────────────────
// Module-level so NotificationContext can read the same slice without
// duplicating the seed data.
export let _mockNotifications = mockNotifications.map(n => ({ ...n }))

/** Replace the in-memory store (used by NotificationContext after mutations). */
export function _setMockNotifications(notifications) {
  _mockNotifications = notifications
}

// ── Helpers ────────────────────────────────────────────────────────
let _nextNotifId = Math.max(...mockNotifications.map(n => n.id), 0) + 1
function nextNotifId() { return _nextNotifId++ }

// ── Public API ─────────────────────────────────────────────────────

/**
 * Fetch notifications for the current user.
 * Backend scopes to user via JWT; mock returns the in-memory store.
 * Returns Notification[].
 */
export async function fetchNotifications() {
  if (USE_MOCK) {
    return [..._mockNotifications]
  }

  // ── Real backend ──
  // GET /notifications → Notification[]
  return api.get('/notifications')
}

/**
 * Mark a single notification as read.
 * @param {number|string} id
 * Returns the updated Notification.
 */
export async function markNotificationRead(id) {
  if (USE_MOCK) {
    const idx = _mockNotifications.findIndex(n => n.id === id || n.id === Number(id))
    if (idx !== -1) {
      _mockNotifications[idx] = { ..._mockNotifications[idx], read: true }
      _setMockNotifications([..._mockNotifications])
      return { ..._mockNotifications[idx] }
    }
    return null
  }

  // ── Real backend ──
  // PATCH /notifications/:id/read → Notification
  return api.patch(`/notifications/${id}/read`)
}

/**
 * Mark all notifications as read for the current user.
 * Returns { updatedCount: number }.
 */
export async function markAllNotificationsRead() {
  if (USE_MOCK) {
    const updated = _mockNotifications.map(n => ({ ...n, read: true }))
    _setMockNotifications(updated)
    return { updatedCount: updated.length }
  }

  // ── Real backend ──
  // POST /notifications/read-all → { updatedCount: number }
  return api.post('/notifications/read-all')
}

/**
 * Create a new notification (used internally when moderation resolves).
 * @param {Partial<Notification>} payload
 * Returns the created Notification.
 */
export async function createNotification(payload) {
  if (USE_MOCK) {
    const notif = {
      id:      nextNotifId(),
      read:    false,
      time:    'just now',
      ...payload,
    }
    _mockNotifications.unshift(notif)
    _setMockNotifications([..._mockNotifications])
    return { ...notif }
  }

  // ── Real backend ──
  // POST /notifications → Notification
  return api.post('/notifications', payload)
}

/**
 * Delete a single notification.
 * @param {number|string} id
 * Returns { success: true }.
 */
export async function deleteNotification(id) {
  if (USE_MOCK) {
    _setMockNotifications(_mockNotifications.filter(n => n.id !== id && n.id !== Number(id)))
    return { success: true }
  }

  // ── Real backend ──
  // DELETE /notifications/:id → { success: true }
  return api.delete(`/notifications/${id}`)
}
