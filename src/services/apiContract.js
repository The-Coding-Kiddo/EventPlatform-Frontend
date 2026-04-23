/**
 * apiContract.js
 *
 * Single source of truth for every backend endpoint this frontend expects.
 * This file is documentation only — nothing here runs at runtime.
 *
 * Format per endpoint:
 *   METHOD  /path
 *   Auth:   required | none | admin | super_admin
 *   Body:   { field: type, ... }  (for POST/PUT/PATCH)
 *   Params: { field: type, ... }  (for GET query strings)
 *   200:    { field: type, ... }  (success response shape)
 *   Errors: [{ status, message }, ...]
 *
 * Role hierarchy: super_admin > institution_admin > citizen > (anonymous)
 */

export const API_CONTRACT = {

  // ── Auth ──────────────────────────────────────────────────────────

  login: {
    method:  'POST',
    path:    '/auth/login',
    auth:    'none',
    body:    { email: 'string', password: 'string' },
    success: { token: 'string (JWT)', user: 'User' },
    errors:  [
      { status: 401, message: 'Invalid credentials' },
    ],
  },

  me: {
    method:  'GET',
    path:    '/auth/me',
    auth:    'required',
    success: 'User',
    errors:  [
      { status: 401, message: 'Token missing or expired' },
    ],
  },

  logout: {
    method:  'POST',
    path:    '/auth/logout',
    auth:    'required',
    success: { success: true },
    notes:   'Frontend also clears the stored token regardless of response.',
  },

  register: {
    method:  'POST',
    path:    '/auth/register',
    auth:    'none',
    body:    { name: 'string', email: 'string', password: 'string', role: '"citizen"' },
    success: { user: 'User' },
    notes:   'Returns the created user only — no token. Caller must redirect to /login.',
    errors:  [
      { status: 400, message: 'Validation error — missing or invalid fields' },
      { status: 409, message: 'Email already registered' },
    ],
  },

  provision: {
    method:  'POST',
    path:    '/auth/provision',
    auth:    'super_admin',
    body:    { name: 'string', email: 'string', password: 'string', role: '"institution_admin"', institution: 'string' },
    success: { user: 'User' },
    notes:   'Backend must verify the caller is a super_admin via JWT. Not exposed to citizens.',
    errors:  [
      { status: 400, message: 'Validation error' },
      { status: 403, message: 'Only super admins may provision institution accounts' },
      { status: 409, message: 'Email already registered' },
    ],
  },

  // ── Events (public) ───────────────────────────────────────────────

  listPublicEvents: {
    method:  'GET',
    path:    '/events',
    auth:    'none',
    params:  {
      category: 'string (optional)',
      city:     'string (optional)',
      search:   'string (optional)',
      page:     'number (optional, default 1)',
      limit:    'number (optional, default 20)',
    },
    success: { data: 'Event[]', total: 'number', page: 'number', pages: 'number' },
    notes:   'Only returns events with status="approved".',
  },

  getEvent: {
    method:  'GET',
    path:    '/events/:id',
    auth:    'none',
    success: 'Event',
    errors:  [
      { status: 404, message: 'Event not found' },
    ],
  },

  // ── Events (authenticated) ────────────────────────────────────────

  submitEvent: {
    method:  'POST',
    path:    '/events',
    auth:    'required (institution_admin)',
    body:    {
      title:       'string',
      description: 'string',
      category:    'string',
      date:        'string (YYYY-MM-DD)',
      time:        'string',
      location:    'string',
      venue:       'string',
      price:       'number',
      capacity:    'number',
      image:       'string (URL, optional)',
      tags:        'string[] (optional)',
    },
    success: { event: 'Event', moderation: 'ModerationQueueItem' },
    notes:   'Backend runs risk analysis server-side and creates a queue entry. Returns status="pending".',
    errors:  [
      { status: 400, message: 'Validation error — missing required fields' },
      { status: 403, message: 'Only institution admins may submit events' },
    ],
  },

  saveDraft: {
    method:  'POST',
    path:    '/events/draft',
    auth:    'required (institution_admin)',
    body:    '(same as submitEvent — all fields optional)',
    success: 'Event (status="draft")',
  },

  updateEvent: {
    method:  'PUT',
    path:    '/events/:id',
    auth:    'required (institution_admin — own events only)',
    body:    '(same fields as submitEvent, partial)',
    success: 'Event',
    errors:  [
      { status: 403, message: 'Cannot edit events that are approved or owned by another institution' },
      { status: 404, message: 'Event not found' },
    ],
  },

  deleteEvent: {
    method:  'DELETE',
    path:    '/events/:id',
    auth:    'required (institution_admin — own drafts/rejected only; super_admin — any)',
    success: { success: true },
    errors:  [
      { status: 403, message: 'Cannot delete approved events' },
      { status: 404, message: 'Event not found' },
    ],
  },

  // ── Event interactions (citizen) ──────────────────────────────────

  saveEvent: {
    method:  'POST',
    path:    '/events/:id/save',
    auth:    'required',
    success: { success: true },
    notes:   'Idempotent — saving an already-saved event is a no-op.',
    errors:  [
      { status: 404, message: 'Event not found' },
    ],
  },

  unsaveEvent: {
    method:  'DELETE',
    path:    '/events/:id/save',
    auth:    'required',
    success: { success: true },
    notes:   'Idempotent — unsaving an event not in the user\'s list is a no-op.',
  },

  registerForEvent: {
    method:  'POST',
    path:    '/events/:id/register',
    auth:    'required',
    success: { success: true },
    notes:   'Idempotent — registering for an event the user already registered for is a no-op.',
    errors:  [
      { status: 400, message: 'Event is at capacity' },
      { status: 404, message: 'Event not found' },
    ],
  },

  // ── User preferences ──────────────────────────────────────────────

  updateSubscriptions: {
    method:  'PUT',
    path:    '/user/subscriptions',
    auth:    'required',
    body:    { categories: 'string[]' },
    success: { subscriptions: 'string[]' },
    notes:   'Replaces the full subscription list. Send the complete desired array.',
  },

  // ── Admin — all events ────────────────────────────────────────────

  listAllEvents: {
    method:  'GET',
    path:    '/events/all',
    auth:    'admin',
    params:  {
      institutionId: 'string (optional — institution_admin scoped automatically)',
      status:        'string (optional: draft|pending|approved|rejected)',
    },
    success: 'Event[]',
    notes:   'institution_admin always scoped to their institution; super_admin sees all.',
  },

  // ── Moderation ────────────────────────────────────────────────────

  getModerationQueue: {
    method:  'GET',
    path:    '/admin/moderation',
    auth:    'admin',
    params:  { status: 'string (optional: pending|approved|rejected)' },
    success: 'ModerationQueueItem[]',
  },

  approveEvent: {
    method:  'POST',
    path:    '/admin/moderation/:queueId/approve',
    auth:    'admin',
    body:    { note: 'string (optional)' },
    success: { queueItem: 'ModerationQueueItem', event: 'Event' },
    errors:  [
      { status: 404, message: 'Queue item not found' },
      { status: 409, message: 'Already resolved' },
    ],
  },

  rejectEvent: {
    method:  'POST',
    path:    '/admin/moderation/:queueId/reject',
    auth:    'admin',
    body:    { note: 'string (required — rejection reason)' },
    success: { queueItem: 'ModerationQueueItem', event: 'Event' },
    errors:  [
      { status: 400, message: 'Rejection note is required' },
      { status: 404, message: 'Queue item not found' },
    ],
  },

  // ── Analytics ─────────────────────────────────────────────────────

  getAnalytics: {
    method:  'GET',
    path:    '/admin/analytics',
    auth:    'super_admin',
    success: {
      totalEvents:        'number',
      pendingModeration:  'number',
      approvedEvents:     'number',
      rejectedEvents:     'number',
      approvalRate:       'number (0–100)',
      avgRiskScore:       'number',
      totalInstitutions:  'number',
      activeInstitutions: 'number',
      totalUsers:         'number',
    },
  },

  // ── Institutions ──────────────────────────────────────────────────

  listInstitutions: {
    method:  'GET',
    path:    '/admin/institutions',
    auth:    'super_admin',
    success: 'Institution[]',
  },

  suspendInstitution: {
    method:  'PATCH',
    path:    '/admin/institutions/:id/suspend',
    auth:    'super_admin',
    success: 'Institution',
    errors:  [
      { status: 404, message: 'Institution not found' },
      { status: 409, message: 'Institution already suspended' },
    ],
  },

  unsuspendInstitution: {
    method:  'PATCH',
    path:    '/admin/institutions/:id/unsuspend',
    auth:    'super_admin',
    success: 'Institution',
    errors:  [
      { status: 404, message: 'Institution not found' },
      { status: 409, message: 'Institution is not suspended' },
    ],
  },

  // ── User management (super-admin) ─────────────────────────────────

  listUsers: {
    method:  'GET',
    path:    '/admin/users',
    auth:    'super_admin',
    params:  {
      role:   'string (optional: citizen|institution_admin)',
      status: 'string (optional: active|suspended)',
    },
    success: 'User[]',
  },

  updateUser: {
    method:  'PATCH',
    path:    '/admin/users/:id',
    auth:    'super_admin',
    body:    { status: '"active"|"suspended"' },
    success: 'User',
    notes:   'Currently used to suspend/unsuspend users. Extend body for other mutations.',
    errors:  [
      { status: 404, message: 'User not found' },
    ],
  },

  // ── Notifications ─────────────────────────────────────────────────

  listNotifications: {
    method:  'GET',
    path:    '/notifications',
    auth:    'required',
    success: 'Notification[]',
    notes:   'Backend returns only notifications scoped to the authenticated user.',
  },

  markNotificationRead: {
    method:  'PATCH',
    path:    '/notifications/:id/read',
    auth:    'required',
    success: 'Notification',
    errors:  [
      { status: 404, message: 'Notification not found' },
    ],
  },

  markAllNotificationsRead: {
    method:  'POST',
    path:    '/notifications/read-all',
    auth:    'required',
    success: { updatedCount: 'number' },
  },

  createNotification: {
    method:  'POST',
    path:    '/notifications',
    auth:    'admin',
    body:    {
      userId:      'string (target user; omit to broadcast by role)',
      forRole:     'string (optional: citizen|institution_admin|super_admin)',
      forCategory: 'string (optional)',
      forInstitution: 'string (optional)',
      type:        'string (event_reminder|new_event|moderation_result|subscription)',
      title:       'string',
      message:     'string',
      eventId:     'number (optional)',
    },
    success: 'Notification',
  },

  deleteNotification: {
    method:  'DELETE',
    path:    '/notifications/:id',
    auth:    'required',
    success: { success: true },
  },
}

// ── Type reference ─────────────────────────────────────────────────
// Full JSDoc shapes are in src/models/index.js.
// Quick summary:
//
// User           { id, name, email, role, institutionId, institution, avatar,
//                  isActive, status, subscriptions, savedEvents, registeredEvents }
// Event          { id, title, category, date, time, location, venue, image, price, capacity,
//                  attendees, status, featured, description, tags, organizer, institution,
//                  institutionId, riskScore, riskLevel, moderationReason,
//                  lat, lng, createdAt, updatedAt }
// ModerationQueueItem  { id, eventId, eventTitle, submittedBy, institution, institutionId,
//                        category, location, date, submittedAt, resolvedAt, status,
//                        riskScore, riskLevel, flagReason, autoFlags, requiresManualReview,
//                        note, description, tags, time, price, capacity, venue }
// Notification   { id, type, title, message, time, createdAt, read, eventId,
//                  forRole, forUserId, forInstitution, forInstitutionId, forCategory }
// Institution    { id, name, email, status, memberSince, eventsPublished }
