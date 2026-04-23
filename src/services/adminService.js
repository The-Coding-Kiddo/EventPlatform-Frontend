/**
 * adminService.js
 *
 * Super-admin and institution-admin operations: moderation queue management,
 * institution CRUD, and platform analytics.
 * - Mock mode: mutates the in-memory stores exposed by eventService.
 * - Backend mode: calls the admin REST endpoints.
 */

import { api, USE_MOCK } from './apiClient'
import {
  _mockEvents,
  _mockModerationQueue,
  _setMockEvents,
  _setMockQueue,
} from './eventService'
import { listRegisteredUsers } from './authService'
import { mockUsers, mockAnalytics } from '../data/mockData'

// ── In-memory institution store (mock only) ───────────────────────
// Derived once from event data; mutations (suspend/unsuspend) are applied
// here so they persist within the session without a full re-derive.
let _mockInstitutions = null

function getMockInstitutions() {
  if (_mockInstitutions) return _mockInstitutions
  const seen = new Set()
  _mockInstitutions = []
  _mockEvents.forEach(e => {
    const name = e.institution || e.organizer
    if (name && !seen.has(name)) {
      seen.add(name)
      _mockInstitutions.push({
        id:              name,
        name,
        status:          'active',
        eventsPublished: _mockEvents.filter(ev => ev.institution === name).length,
      })
    }
  })
  return _mockInstitutions
}

// ── Moderation ────────────────────────────────────────────────────

/**
 * Fetch the full moderation queue.
 * Optional filter: status ('pending' | 'approved' | 'rejected')
 * Returns ModerationQueueItem[].
 */
export async function fetchModerationQueue(status) {
  if (USE_MOCK) {
    const queue = [..._mockModerationQueue]
    return status ? queue.filter(q => q.status === status) : queue
  }

  // ── Real backend ──
  // GET /admin/moderation?status=pending
  return api.get('/admin/moderation', status ? { status } : undefined)
}

/**
 * Approve an event in the moderation queue.
 * @param {string} queueId  - ID of the ModerationQueueItem
 * @param {string} [note]   - Optional reviewer note
 * Returns { queueItem, event }.
 */
export async function approveEvent(queueId, note = '') {
  if (USE_MOCK) {
    const now = new Date().toISOString()

    const queueIdx = _mockModerationQueue.findIndex(q => q.id === queueId)
    if (queueIdx === -1) throw new Error(`Queue item ${queueId} not found`)

    const queueItem = { ..._mockModerationQueue[queueIdx], status: 'approved', note, resolvedAt: now }
    _mockModerationQueue[queueIdx] = queueItem
    _setMockQueue([..._mockModerationQueue])

    // Match by eventId if present; the seed data has no eventId so event will be null
    const eventIdx = queueItem.eventId != null
      ? _mockEvents.findIndex(e => e.id === queueItem.eventId)
      : -1
    let event = null
    if (eventIdx !== -1) {
      event = { ..._mockEvents[eventIdx], status: 'approved', updatedAt: now }
      _mockEvents[eventIdx] = event
      _setMockEvents([..._mockEvents])
    }

    return { queueItem, event }
  }

  // ── Real backend ──
  // POST /admin/moderation/:queueId/approve → { queueItem, event }
  return api.post(`/admin/moderation/${queueId}/approve`, { note })
}

/**
 * Reject an event in the moderation queue.
 * @param {string} queueId
 * @param {string} [note] - Required reason (enforced by backend; warn in UI).
 * Returns { queueItem, event }.
 */
export async function rejectEvent(queueId, note = '') {
  if (USE_MOCK) {
    const now = new Date().toISOString()

    const queueIdx = _mockModerationQueue.findIndex(q => q.id === queueId)
    if (queueIdx === -1) throw new Error(`Queue item ${queueId} not found`)

    const queueItem = { ..._mockModerationQueue[queueIdx], status: 'rejected', note, resolvedAt: now }
    _mockModerationQueue[queueIdx] = queueItem
    _setMockQueue([..._mockModerationQueue])

    const eventIdx = queueItem.eventId != null
      ? _mockEvents.findIndex(e => e.id === queueItem.eventId)
      : -1
    let event = null
    if (eventIdx !== -1) {
      event = { ..._mockEvents[eventIdx], status: 'rejected', updatedAt: now }
      _mockEvents[eventIdx] = event
      _setMockEvents([..._mockEvents])
    }

    return { queueItem, event }
  }

  // ── Real backend ──
  // POST /admin/moderation/:queueId/reject → { queueItem, event }
  return api.post(`/admin/moderation/${queueId}/reject`, { note })
}

// ── Platform analytics (super-admin) ─────────────────────────────

/**
 * Fetch high-level platform stats.
 * Returns AnalyticsSummary: { totalEvents, pendingModeration, approvalRate,
 *   avgRiskScore, totalInstitutions, totalUsers, ... }
 */
export async function fetchAnalytics() {
  if (USE_MOCK) {
    const events    = _mockEvents
    const queue     = _mockModerationQueue
    const pending   = events.filter(e => e.status === 'pending').length
    const approved  = events.filter(e => e.status === 'approved').length
    const rejected  = events.filter(e => e.status === 'rejected').length
    const total     = approved + rejected
    const avgRisk   = events.length
      ? Math.round(events.reduce((s, e) => s + (e.riskScore || 0), 0) / events.length)
      : 0

    return {
      totalEvents:        events.length,
      pendingModeration:  pending,
      approvedEvents:     approved,
      rejectedEvents:     rejected,
      approvalRate:       total ? Math.round((approved / total) * 100) : 0,
      avgRiskScore:       avgRisk,
      // User/institution aggregates — mocked; backend would compute these server-side:
      totalInstitutions:  mockAnalytics.totalInstitutions,
      totalUsers:         mockAnalytics.totalUsers,
      activeInstitutions: mockAnalytics.activeInstitutions,
      eventsThisMonth:    mockAnalytics.eventsThisMonth,
      // Chart series — mocked; backend returns these from the /admin/analytics endpoint:
      monthlyEvents:        mockAnalytics.monthlyEvents,
      categoryDistribution: mockAnalytics.categoryDistribution,
      topCities:            mockAnalytics.topCities,
      recentActivity:       mockAnalytics.recentActivity,
    }
  }

  // ── Real backend ──
  // GET /admin/analytics → AnalyticsSummary
  return api.get('/admin/analytics')
}

// ── User management (super-admin) ────────────────────────────────

/**
 * Fetch all registered users: seed users + dynamically registered users.
 * Returns User[].
 */
export async function fetchUsers() {
  if (USE_MOCK) {
    // Combine seed users with any users created via the citizen/admin signup flows.
    const registered = listRegisteredUsers()
    const seedIds    = new Set(mockUsers.map(u => String(u.id)))
    // Avoid duplicates if a seed user email was also registered dynamically
    const uniqueReg  = registered.filter(u => !seedIds.has(String(u.id)))
    return [...mockUsers, ...uniqueReg]
  }

  // ── Real backend ──
  // GET /admin/users → User[]
  return api.get('/admin/users')
}

// ── Institution management (super-admin) ──────────────────────────

/**
 * Fetch all registered institutions.
 * Returns Institution[].
 */
export async function fetchInstitutions() {
  if (USE_MOCK) {
    return [...getMockInstitutions()]
  }

  // ── Real backend ──
  // GET /admin/institutions → Institution[]
  return api.get('/admin/institutions')
}

/**
 * Suspend an institution (sets status → 'suspended').
 * @param {string} institutionId
 * Returns Institution.
 */
export async function suspendInstitution(institutionId) {
  if (USE_MOCK) {
    const inst = getMockInstitutions().find(i => i.id === institutionId)
    if (!inst) throw new Error(`Institution ${institutionId} not found`)
    inst.status = 'suspended'
    return { ...inst }
  }

  // ── Real backend ──
  // PATCH /admin/institutions/:id/suspend → Institution
  return api.patch(`/admin/institutions/${institutionId}/suspend`)
}

/**
 * Restore a suspended institution (sets status → 'active').
 * @param {string} institutionId
 * Returns Institution.
 */
export async function unsuspendInstitution(institutionId) {
  if (USE_MOCK) {
    const inst = getMockInstitutions().find(i => i.id === institutionId)
    if (!inst) throw new Error(`Institution ${institutionId} not found`)
    inst.status = 'active'
    return { ...inst }
  }

  // ── Real backend ──
  // PATCH /admin/institutions/:id/unsuspend → Institution
  return api.patch(`/admin/institutions/${institutionId}/unsuspend`)
}
