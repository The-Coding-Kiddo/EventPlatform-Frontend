/**
 * eventService.js
 *
 * All event-related API calls live here.
 * - Mock mode: operates on mockEvents in memory and runs moderation locally.
 * - Backend mode: calls the REST endpoints documented in apiContract.js.
 *
 * Import USE_MOCK and swap to real calls by setting VITE_USE_MOCK=false.
 */

import { api, USE_MOCK } from './apiClient'
import { analyzeEvent } from './moderationService'
import { mockEvents, mockModerationQueue } from '../data/mockData'

// ── In-memory mock stores (mirrors what the backend would persist) ──
// These are module-level so EventContext can also import them for
// initializing its own state without duplicating data.
export let _mockEvents        = [...mockEvents]
export let _mockModerationQueue = [...mockModerationQueue]

/** Replace the in-memory store (used by EventContext after context mutations). */
export function _setMockEvents(events)         { _mockEvents = events }
export function _setMockQueue(queue)           { _mockModerationQueue = queue }

/**
 * Bump the ID counters so IDs generated after loading persisted data
 * don't collide with already-created IDs.
 * Called by EventContext when it restores state from localStorage.
 */
export function _setNextEventId(n) { if (n > _nextEventId) _nextEventId = n }
export function _setNextQueueId(n) { if (n > _nextQueueId) _nextQueueId = n }

// ── Helpers ───────────────────────────────────────────────────────
let _nextEventId = Math.max(...mockEvents.map(e => Number(e.id) || 0), 0) + 1
let _nextQueueId = Math.max(...mockModerationQueue.map(q => Number(q.id) || 0), 0) + 1

function nextEventId() { return _nextEventId++ }
function nextQueueId() { return _nextQueueId++ }

// ── Public API ────────────────────────────────────────────────────

/**
 * Fetch all publicly visible (approved) events.
 * Supports optional filters: { category, city, search, page, limit }
 * Returns Event[].
 */
export async function fetchPublicEvents(filters = {}) {
  if (USE_MOCK) {
    let events = _mockEvents.filter(e => e.status === 'approved')
    if (filters.category) events = events.filter(e => e.category === filters.category)
    if (filters.city)     events = events.filter(e => e.location?.toLowerCase().includes(filters.city.toLowerCase()))
    if (filters.search)   events = events.filter(e =>
      e.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      e.description?.toLowerCase().includes(filters.search.toLowerCase())
    )
    return events
  }

  // ── Real backend ──
  // GET /events?category=...&city=...&search=...&page=...&limit=...
  return api.get('/events', filters)
}

/**
 * Fetch all events (all statuses). Super-admin / institution-admin use only.
 * Optionally scoped to a specific institution.
 * Returns Event[].
 */
export async function fetchAllEvents(institutionId) {
  if (USE_MOCK) {
    if (institutionId) {
      return _mockEvents.filter(e => e.institution === institutionId || e.institutionId === institutionId)
    }
    return [..._mockEvents]
  }

  // ── Real backend ──
  // GET /events/all?institutionId=...
  return api.get('/events/all', institutionId ? { institutionId } : undefined)
}

/**
 * Fetch a single event by ID.
 * Returns Event or null.
 */
export async function fetchEvent(id) {
  if (USE_MOCK) {
    return _mockEvents.find(e => e.id === id || e.id === Number(id)) ?? null
  }

  // ── Real backend ──
  // GET /events/:id
  return api.get(`/events/${id}`)
}

/**
 * Submit a new event for moderation.
 * Runs risk analysis in mock mode before creating the queue entry.
 * Returns { event: Event, moderation: ModerationQueueItem }.
 */
export async function submitEvent(payload) {
  if (USE_MOCK) {
    const moderation  = analyzeEvent(payload)
    const now         = new Date().toISOString()
    const newEvent    = {
      ...payload,
      // Belt-and-suspenders: normalizeEventPayload should have set institution,
      // but guarantee it here so the filter e.institution === user.institution always matches.
      institution: payload.institution || payload.organizer || '',
      id:          nextEventId(),
      status:      'pending',
      attendees:   0,
      riskScore:   moderation.riskScore,
      createdAt:   now,
      updatedAt:   now,
    }

    const queueEntry = {
      id:          nextQueueId(),
      eventId:     newEvent.id,
      // Use the same field names as the existing mockModerationQueue data
      eventTitle:  newEvent.title,
      submittedBy: newEvent.organizer || newEvent.institution || 'Unknown',
      institution: newEvent.institution || '',
      category:    newEvent.category,
      location:    newEvent.location || '',
      date:        newEvent.date,
      submittedAt: now,
      status:      'pending_review',
      riskScore:   moderation.riskScore,
      riskLevel:   moderation.riskLevel,
      flagReason:  moderation.flagReason,
      autoFlags:   moderation.autoFlags || [],
      requiresManualReview: moderation.requiresManualReview,
      note:        '',
      // Full event details — needed for rich moderation review
      description: newEvent.description || '',
      tags:        newEvent.tags        || [],
      time:        newEvent.time        || '',
      price:       newEvent.price       ?? 0,
      capacity:    newEvent.capacity    ?? 0,
      venue:       newEvent.venue       || '',
    }

    _mockEvents.push(newEvent)
    _mockModerationQueue.push(queueEntry)

    return { event: { ...newEvent }, moderation: { ...queueEntry } }
  }

  // ── Real backend ──
  // POST /events → { event: Event, moderation: ModerationQueueItem }
  return api.post('/events', payload)
}

/**
 * Save an event as a draft (not submitted for moderation yet).
 * Returns Event with status:'draft'.
 */
export async function saveDraft(payload) {
  if (USE_MOCK) {
    const now      = new Date().toISOString()
    const draft    = {
      ...payload,
      institution: payload.institution || payload.organizer || '',
      id:        nextEventId(),
      status:    'draft',
      attendees: 0,
      riskScore: 0,
      createdAt: now,
      updatedAt: now,
    }
    _mockEvents.push(draft)
    return { ...draft }
  }

  // ── Real backend ──
  // POST /events/draft → Event
  return api.post('/events/draft', payload)
}

/**
 * Update an existing draft (or re-submit a rejected event).
 * Returns the updated Event.
 */
export async function updateEvent(id, payload) {
  if (USE_MOCK) {
    const idx = _mockEvents.findIndex(e => e.id === id || e.id === Number(id))
    if (idx === -1) throw new Error(`Event ${id} not found`)
    _mockEvents[idx] = { ..._mockEvents[idx], ...payload, updatedAt: new Date().toISOString() }
    return { ..._mockEvents[idx] }
  }

  // ── Real backend ──
  // PUT /events/:id → Event
  return api.put(`/events/${id}`, payload)
}

/**
 * Delete an event (draft or rejected only — admins may delete any).
 */
export async function deleteEvent(id) {
  if (USE_MOCK) {
    const idx = _mockEvents.findIndex(e => e.id === id || e.id === Number(id))
    if (idx !== -1) _mockEvents.splice(idx, 1)
    return { success: true }
  }

  // ── Real backend ──
  // DELETE /events/:id → { success: true }
  return api.delete(`/events/${id}`)
}
