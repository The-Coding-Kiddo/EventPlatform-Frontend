/**
 * models/index.js
 *
 * Canonical JSDoc type definitions for every domain object used across
 * the frontend. No runtime logic except the two normalizer helpers at the bottom.
 *
 * How to use:
 *   import { normalizeEventPayload, normalizeUser } from '../models'
 *
 * When connecting to the real backend, pass every API response through
 * the appropriate normalizer so field-name differences are handled in
 * one place instead of scattered across components.
 */

// ── User ──────────────────────────────────────────────────────────

/**
 * @typedef {Object} User
 * @property {string}      id
 * @property {string}      name             - Display name
 * @property {string}      email
 * @property {'citizen'|'institution_admin'|'super_admin'} role
 * @property {string|null} institutionId    - null for citizen / super_admin
 * @property {string|null} institution      - Institution display name (denormalised)
 *                                            Backend may send as "institutionName"
 * @property {string}      avatar           - Two-letter initials, e.g. 'AR'
 * @property {boolean}     isActive         - true when status === 'active'
 * @property {'active'|'suspended'} status
 * @property {string[]}    subscriptions    - Category names the user follows
 * @property {(number|string)[]} savedEvents      - IDs of saved events
 * @property {(number|string)[]} registeredEvents - IDs of events the user registered for
 */

// ── Event ─────────────────────────────────────────────────────────

/**
 * @typedef {'draft'|'pending'|'approved'|'rejected'} EventStatus
 * @typedef {'low'|'medium'|'high'} RiskLevel
 */

/**
 * @typedef {Object} Event
 * @property {number|string} id
 * @property {string}        title
 * @property {string}        description
 * @property {string}        category
 * @property {string[]}      tags
 * @property {string}        date          - 'YYYY-MM-DD'
 * @property {string}        time          - Human-readable, e.g. '09:00 AM'
 * @property {string}        location      - 'City, Country/State'
 * @property {string}        venue
 * @property {string}        [image]       - URL
 * @property {number}        price         - 0 = free
 * @property {number}        capacity
 * @property {number}        attendees
 * @property {string}        organizer
 * @property {string}        institution   - Institution display name
 * @property {string}        [institutionId]
 * @property {EventStatus}   status
 * @property {boolean}       [featured]
 * @property {number}        [riskScore]   - 0–100; set by backend after submission
 * @property {RiskLevel}     [riskLevel]   - 'low' | 'medium' | 'high'
 * @property {string}        [moderationReason] - Populated on rejection
 * @property {number}        [lat]
 * @property {number}        [lng]
 * @property {string}        [createdAt]   - ISO timestamp
 * @property {string}        [updatedAt]   - ISO timestamp
 */

// ── ModerationQueueItem ───────────────────────────────────────────

/**
 * @typedef {'pending_review'|'approved'|'rejected'} ModerationStatus
 */

/**
 * @typedef {Object} ModerationQueueItem
 * @property {string|number}    id
 * @property {number|string}    eventId
 * @property {string}           eventTitle      - Display title (mirrors Event.title)
 * @property {string}           submittedBy     - Organizer / institution display name
 * @property {string}           institution     - Institution display name
 * @property {string}           [institutionId]
 * @property {string}           category
 * @property {string}           location
 * @property {string}           date            - Event date 'YYYY-MM-DD'
 * @property {string}           submittedAt     - ISO timestamp of queue submission
 * @property {string}           [resolvedAt]    - ISO timestamp when approved/rejected
 * @property {ModerationStatus} status
 * @property {number}           riskScore       - 0–100
 * @property {RiskLevel}        riskLevel
 * @property {string}           flagReason      - Primary flag description
 * @property {string[]}         autoFlags       - Machine-detected flag keys
 * @property {boolean}          requiresManualReview
 * @property {string}           [note]          - Reviewer note (formerly reviewNote)
 * @property {string}           [description]   - Full event description (for review UI)
 * @property {string[]}         [tags]
 * @property {string}           [time]
 * @property {number}           [price]
 * @property {number}           [capacity]
 * @property {string}           [venue]
 *
 * @note Backend field-name alignment:
 *   Frontend "eventTitle" ← backend may send "title"
 *   Frontend "flagReason" ← backend may send "moderationReason"
 *   Frontend "autoFlags"  ← backend may send "flags"
 *   Use normalizeModerationItem() when connecting to the real backend.
 */

// ── Notification ──────────────────────────────────────────────────

/**
 * @typedef {'event_reminder'|'new_event'|'subscription'|'event_update'|'event_approved'|'event_rejected'} NotificationType
 */

/**
 * @typedef {Object} Notification
 * @property {number|string}    id
 * @property {NotificationType} type
 * @property {string}           title
 * @property {string}           message
 * @property {boolean}          read
 * @property {string}           [time]           - Relative display string, e.g. '2 hr ago'
 * @property {string}           [createdAt]      - ISO timestamp (prefer over time for sorting)
 * @property {number|null}      [eventId]
 * @property {string}           [forRole]        - Target role filter
 * @property {string}           [forUserId]      - Target specific user ID
 * @property {string}           [forInstitution] - Target institution name (mock)
 * @property {string}           [forInstitutionId] - Target institution ID (backend)
 * @property {string}           [forCategory]    - Target category subscription filter
 *
 * @note Backend uses forUserId / forInstitutionId (IDs).
 *       Mock uses forInstitution (name string) for simplicity.
 */

// ── Institution ───────────────────────────────────────────────────

/**
 * @typedef {Object} Institution
 * @property {string}              id
 * @property {string}              name
 * @property {string}              [email]          - Admin contact email
 * @property {'active'|'suspended'} status
 * @property {string}              [memberSince]    - ISO date string or 'YYYY-MM-DD'
 * @property {number}              eventsPublished
 * @property {number}              [eventCount]     - Alias for eventsPublished (legacy)
 */

// ── Auth responses ────────────────────────────────────────────────

/**
 * @typedef {Object} LoginResponse
 * @property {string} token  - JWT (or mock token)
 * @property {User}   user
 */

/**
 * @typedef {Object} RegisterResponse
 * @property {User} user  - Created user (no token; caller must redirect to /login)
 */

/**
 * @typedef {Object} AnalyticsSummary
 * @property {number} totalEvents
 * @property {number} pendingModeration
 * @property {number} approvedEvents
 * @property {number} rejectedEvents
 * @property {number} approvalRate        - 0–100
 * @property {number} avgRiskScore
 * @property {number} totalInstitutions
 * @property {number} activeInstitutions
 * @property {number} totalUsers
 */

// ─────────────────────────────────────────────────────────────────
// Runtime normalizers
// Call these on every inbound API response so field-name differences
// between the backend and the frontend are resolved in one place.
// ─────────────────────────────────────────────────────────────────

/**
 * Map a raw backend user response to the canonical User shape.
 *
 * Handles common backend naming variations:
 *   institution_name / institutionName → institution
 *   institution_id   / institutionId  → institutionId
 *   is_active / active                → isActive + status
 *   registered_events                 → registeredEvents
 *   saved_events                      → savedEvents
 *
 * @param {Object} raw - User object as returned by the backend
 * @returns {User}
 */
export function normalizeUser(raw) {
  const status = raw.status ?? (raw.is_active || raw.isActive ? 'active' : 'active')
  return {
    id:               raw.id,
    name:             raw.name             ?? '',
    email:            raw.email            ?? '',
    role:             raw.role             ?? 'citizen',
    institutionId:    raw.institutionId    ?? raw.institution_id   ?? null,
    institution:      raw.institution      ?? raw.institutionName  ?? raw.institution_name ?? null,
    avatar:           raw.avatar           ?? (raw.name ? raw.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '??'),
    isActive:         status === 'active',
    status:           status,
    subscriptions:    raw.subscriptions    ?? [],
    savedEvents:      raw.savedEvents      ?? raw.saved_events      ?? [],
    registeredEvents: raw.registeredEvents ?? raw.registered_events ?? [],
  }
}

/**
 * Map a raw backend moderation queue item to the canonical ModerationQueueItem shape.
 *
 * Handles backend naming variations:
 *   title            → eventTitle   (backend sends "title", frontend uses "eventTitle")
 *   moderationReason → flagReason
 *   flags            → autoFlags
 *   reviewNote       → note
 *
 * @param {Object} raw - Queue item as returned by the backend
 * @returns {ModerationQueueItem}
 */
export function normalizeModerationItem(raw) {
  return {
    id:                   raw.id,
    eventId:              raw.eventId               ?? null,
    eventTitle:           raw.eventTitle            ?? raw.title ?? '',
    submittedBy:          raw.submittedBy           ?? raw.organizer ?? '',
    institution:          raw.institution           ?? '',
    institutionId:        raw.institutionId         ?? null,
    category:             raw.category              ?? '',
    location:             raw.location              ?? '',
    date:                 raw.date                  ?? '',
    submittedAt:          raw.submittedAt           ?? new Date().toISOString(),
    resolvedAt:           raw.resolvedAt            ?? null,
    status:               raw.status                ?? 'pending_review',
    riskScore:            raw.riskScore             ?? 0,
    riskLevel:            raw.riskLevel             ?? 'low',
    flagReason:           raw.flagReason            ?? raw.moderationReason ?? '',
    autoFlags:            raw.autoFlags             ?? raw.flags ?? [],
    requiresManualReview: raw.requiresManualReview  ?? false,
    note:                 raw.note                  ?? raw.reviewNote ?? '',
    // Optional full-event fields (present on newly submitted events, absent on legacy)
    description:          raw.description           ?? '',
    tags:                 raw.tags                  ?? [],
    time:                 raw.time                  ?? '',
    price:                raw.price                 ?? 0,
    capacity:             raw.capacity              ?? 0,
    venue:                raw.venue                 ?? '',
  }
}

// ── normalizeEventPayload ─────────────────────────────────────────

/**
 * Strip frontend-only fields and coerce types before sending an event
 * payload to the backend (or to eventService.submitEvent / saveDraft).
 *
 * Frontend-only fields that must NOT go to the API:
 *   attendees, riskScore, riskLevel, featured, lat, lng, createdAt, updatedAt
 *
 * @param {Partial<Event>} formData - Raw data from EventForm state
 * @returns {Object} Clean payload safe for POST /events or POST /events/draft
 */
export function normalizeEventPayload(formData) {
  const {
    // Strip read-only / computed fields — backend sets these
    id,
    attendees,
    riskScore,
    riskLevel,
    moderationReason,
    featured,
    createdAt,
    updatedAt,
    // Strip form-UI state that must never reach the data layer
    tagInput,
    // Strip frontend-only field not accepted by backend DTO
    organizer,
    status,
    // Keep everything else
    ...rest
  } = formData

  return {
    ...rest,
    // Always populate institution — fall back to organizer if the form didn't set it.
    institution: rest.institution || organizer || '',
    // Coerce numeric strings coming from form inputs
    price:    Number(rest.price)    || 0,
    capacity: Number(rest.capacity) || 0,
    // Ensure tags is always an array
    tags: Array.isArray(rest.tags)
      ? rest.tags
      : (rest.tags ? String(rest.tags).split(',').map(t => t.trim()).filter(Boolean) : []),
    // Trim whitespace from string fields
    title:       rest.title?.trim()       ?? '',
    description: rest.description?.trim() ?? '',
    location:    rest.location?.trim()    ?? '',
    venue:       rest.venue?.trim()       ?? '',
  }
}
