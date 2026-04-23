import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  fetchAllEvents,
  submitEvent    as svcSubmitEvent,
  saveDraft      as svcSaveDraft,
  updateEvent    as svcUpdateEvent,
  deleteEvent    as svcDeleteEvent,
  _mockEvents,
  _mockModerationQueue,
  _setNextEventId,
  _setNextQueueId,
} from '../services/eventService'
import {
  fetchModerationQueue,
  approveEvent,
  rejectEvent,
} from '../services/adminService'
import { USE_MOCK } from '../services/apiClient'
import { useNotifications } from './NotificationContext'
import { storageGet, storageSet } from '../utils/storage'

// Safe default so useEvents() never returns null during HMR module reloads.
const EventContext = createContext({
  events: [], publicEvents: [], moderationQueue: [], eventsLoading: false,
  submitEvent: async () => ({}), saveDraft: async () => ({}),
  updateEvent: async () => ({}), deleteEvent: async () => {},
  resolveModeration: async () => {},
  getInstitutionEvents: () => [], getDrafts: () => [],
})

// ── localStorage initializers (mock mode only) ────────────────────
// Returns persisted data if present; otherwise seeds from mock data.
// Also bumps the ID counters so new IDs never collide with stored ones.
function initEvents() {
  if (!USE_MOCK) return []
  const stored = storageGet('events', null)
  if (stored !== null) {
    if (stored.length > 0) {
      _setNextEventId(Math.max(...stored.map(e => Number(e.id) || 0)) + 1)
    }
    return stored
  }
  return [..._mockEvents]
}

function initQueue() {
  if (!USE_MOCK) return []
  const stored = storageGet('mod_queue', null)
  if (stored !== null) {
    if (stored.length > 0) {
      _setNextQueueId(Math.max(...stored.map(q => Number(q.id) || 0)) + 1)
    }
    return stored
  }
  return [..._mockModerationQueue]
}

export function EventProvider({ children }) {
  const [events,          setEvents]          = useState(initEvents)
  const [moderationQueue, setModerationQueue] = useState(initQueue)
  const [eventsLoading,   setEventsLoading]   = useState(!USE_MOCK)
  const { addNotification } = useNotifications()

  // ── Persist to localStorage whenever state changes (mock mode only) ──
  useEffect(() => { if (USE_MOCK) storageSet('events', events) }, [events])
  useEffect(() => { if (USE_MOCK) storageSet('mod_queue', moderationQueue) }, [moderationQueue])

  // ── Load from backend on mount (real mode only) ──────────────────
  useEffect(() => {
    if (USE_MOCK) return
    Promise.all([
      fetchAllEvents(),
      fetchModerationQueue(),
    ])
      .then(([evts, queue]) => {
        setEvents(evts)
        setModerationQueue(queue)
      })
      .catch(err => console.error('[EventContext] failed to load events', err))
      .finally(() => setEventsLoading(false))
  }, [])

  // ── submitEvent ─────────────────────────────────────────────────
  /**
   * Submit a new event through the moderation pipeline.
   * Returns { event, moderation }.
   */
  const submitEvent = useCallback(async (formData) => {
    const result = await svcSubmitEvent(formData)
    setEvents(prev => [...prev, result.event])
    setModerationQueue(prev => [result.moderation, ...prev])
    return result
  }, [])

  // ── saveDraft ───────────────────────────────────────────────────
  const saveDraft = useCallback(async (formData) => {
    const draft = await svcSaveDraft(formData)
    setEvents(prev => [...prev, draft])
    return draft
  }, [])

  // ── updateEvent ─────────────────────────────────────────────────
  const updateEvent = useCallback(async (id, formData) => {
    const updated = await svcUpdateEvent(id, formData)
    setEvents(prev => prev.map(e => (e.id === id ? updated : e)))
    return updated
  }, [])

  // ── deleteEvent ─────────────────────────────────────────────────
  const deleteEvent = useCallback(async (id) => {
    await svcDeleteEvent(id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }, [])

  // ── resolveModeration ───────────────────────────────────────────
  /**
   * Approve or reject a moderation queue item.
   * Updates both the queue and the event, then fires notifications.
   */
  const resolveModeration = useCallback(async (queueId, action, note = '') => {
    const queueItem = moderationQueue.find(q => q.id === queueId)
    if (!queueItem) return

    let result
    if (action === 'approve') {
      result = await approveEvent(queueId, note)
    } else {
      result = await rejectEvent(queueId, note)
    }

    const { queueItem: updatedQueueItem, event: updatedEvent } = result
    const newStatus = action === 'approve' ? 'approved' : 'rejected'

    setModerationQueue(prev => prev.map(q =>
      q.id === queueId ? { ...q, ...updatedQueueItem } : q
    ))

    if (updatedEvent) {
      setEvents(prev => prev.map(e =>
        e.id === updatedEvent.id ? updatedEvent : e
      ))
    } else {
      // Fallback: update by eventId reference
      setEvents(prev => prev.map(e => {
        const matchById    = queueItem.eventId && e.id === queueItem.eventId
        const matchByTitle = !queueItem.eventId && e.title === (queueItem.title || queueItem.eventTitle)
        return (matchById || matchByTitle) ? { ...e, status: newStatus } : e
      }))
    }

    // Notify the institution admin who submitted
    const eventTitle = queueItem.eventTitle || queueItem.title || 'Event'
    await addNotification({
      type:           newStatus === 'approved' ? 'event_approved' : 'event_rejected',
      title:          newStatus === 'approved' ? 'Event Approved' : 'Event Rejected',
      message:        `"${eventTitle}" has been ${newStatus}${note ? `. Note: ${note}` : '.'}`,
      eventId:        queueItem.eventId ?? null,
      forRole:        'institution_admin',
      forInstitution: queueItem.institution || queueItem.submittedBy || '',
    })

    // Notify subscribed citizens when an event goes live
    if (newStatus === 'approved') {
      await addNotification({
        type:        'new_event',
        title:       `New ${queueItem.category} Event`,
        message:     `"${eventTitle}" is now live`,
        eventId:     queueItem.eventId ?? null,
        forRole:     'citizen',
        forCategory: queueItem.category,
      })
    }
  }, [moderationQueue, addNotification])

  // ── Derived views ────────────────────────────────────────────────
  const publicEvents = events.filter(e => e.status === 'approved')

  const getInstitutionEvents = useCallback((institution) =>
    events.filter(e => e.institution === institution),
  [events])

  const getDrafts = useCallback((institution) =>
    getInstitutionEvents(institution).filter(e => e.status === 'draft'),
  [getInstitutionEvents])

  return (
    <EventContext.Provider value={{
      events,
      publicEvents,
      moderationQueue,
      eventsLoading,
      submitEvent,
      saveDraft,
      updateEvent,
      deleteEvent,
      resolveModeration,
      getInstitutionEvents,
      getDrafts,
    }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => useContext(EventContext)
