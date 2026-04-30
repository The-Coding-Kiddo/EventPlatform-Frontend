/**
 * authService.js
 *
 * All authentication logic lives here.
 * - Mock mode: validates against hard-coded demo credentials, returns a fake token.
 * - Backend mode: calls POST /auth/login and GET /auth/me.
 *
 * Role comes from the user object returned by the backend — never derived from email.
 */

import { api, USE_MOCK, tokenStore } from './apiClient'
import { storageGet, storageSet } from '../utils/storage'

// ── Registered-user store (persisted in localStorage) ────────────
// Schema: Array<{ user: User, password: string }>
// Password is stored in plain text here because this is mock-only;
// a real backend would hash it server-side.
function getRegisteredUsers()       { return storageGet('registered_users', []) }
function saveRegisteredUsers(users) { storageSet('registered_users', users) }

// ── Mock credential store ─────────────────────────────────────────
// Keyed by email so no frontend code needs to know role → email mapping.
const MOCK_CREDENTIALS = {
  'citizen@demo.com': {
    password: '123456',
    user: {
      id: 'u1',
      name: 'Alex Rivera',
      email: 'citizen@demo.com',
      role: 'citizen',
      institutionId: null,
      institution: null,
      avatar: 'AR',
      subscriptions: ['Technology', 'Music', 'Sports'],
      savedEvents: [1, 2, 4],
      registeredEvents: [],
    },
  },
  'admin@demo.com': {
    password: '123456',
    user: {
      id: 'u2',
      name: 'Sarah Johnson',
      email: 'admin@demo.com',
      role: 'institution_admin',
      institutionId: 'inst1',
      institution: 'TechVision Institute',
      avatar: 'SJ',
      subscriptions: ['Technology'],
      savedEvents: [],
      registeredEvents: [],
    },
  },
  'superadmin@demo.com': {
    password: '123456',
    user: {
      id: 'u3',
      name: 'Admin User',
      email: 'superadmin@demo.com',
      role: 'super_admin',
      institutionId: null,
      institution: null,
      avatar: 'AU',
      subscriptions: [],
      savedEvents: [],
      registeredEvents: [],
    },
  },
}

// ── Helpers ───────────────────────────────────────────────────────
function mockTokenFor(userId) {
  return `mock_${userId}_${Date.now()}`
}

function userIdFromMockToken(token) {
  if (!token?.startsWith('mock_')) return null
  return token.split('_')[1] // 'mock_u1_...' → 'u1'
}

// ── Public API ────────────────────────────────────────────────────

/**
 * Authenticate a user with email + password.
 * Returns { token: string, user: User }.
 * Throws on invalid credentials or network error.
 */
export async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase()

  if (USE_MOCK) {
    // Check built-in demo accounts first
    const entry = MOCK_CREDENTIALS[normalizedEmail]
    if (entry && password === entry.password) {
      const token = mockTokenFor(entry.user.id)
      tokenStore.set(token)
      return { token, user: { ...entry.user } }
    }

    // Check user-registered accounts
    const regEntry = getRegisteredUsers().find(r => r.user.email === normalizedEmail)
    if (regEntry && password === regEntry.password) {
      const token = mockTokenFor(regEntry.user.id)
      tokenStore.set(token)
      return { token, user: { ...regEntry.user } }
    }

    throw new Error('Incorrect email or password. Try a demo account below.')
  }

  // ── Real backend ──
  // POST /auth/login → { token: string, user: User }
  const result = await api.post('/auth/login', { email: normalizedEmail, password })
  tokenStore.set(result.token)
  return result
}

/**
 * Restore the current session from a stored token.
 * Called on app mount to keep users logged in after a page refresh.
 * Returns User or null.
 */
export async function getCurrentUser() {
  const token = tokenStore.get()
  if (!token) return null

  if (USE_MOCK) {
    const userId = userIdFromMockToken(token)
    if (!userId) return null

    // Check built-in demo accounts
    const entry = Object.values(MOCK_CREDENTIALS).find(e => e.user.id === userId)
    if (entry) return { ...entry.user }

    // Check user-registered accounts
    const regEntry = getRegisteredUsers().find(r => r.user.id === userId)
    return regEntry ? { ...regEntry.user } : null
  }

  // ── Real backend ──
  // GET /auth/me → User
  return api.get('/auth/me')
}

/**
 * Clear the stored token and end the session.
 */
export function logout() {
  tokenStore.clear()
}

/**
 * Return all user-registered accounts (citizen + institution_admin).
 * Used by AdminDashboard to show dynamically created users in the table.
 * Returns User[] — passwords are never exposed.
 */
export function listRegisteredUsers() {
  return getRegisteredUsers().map(r => r.user)
}

/**
 * Register a new citizen account.
 * Citizens are the only role allowed to self-register.
 * Institution admins and super admins are provisioned manually.
 *
 * Returns { user: User } on success; throws on validation error.
 * Does NOT issue a token — the caller should redirect to /login.
 *
 * Mock mode: persists to localStorage under 'dajis_registered_users'.
 * Backend mode: POST /auth/register → { user: User }
 */
export async function register(name, email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const trimmedName     = name.trim()

  if (USE_MOCK) {
    // Duplicate check against demo accounts
    if (MOCK_CREDENTIALS[normalizedEmail]) {
      throw new Error('An account with this email already exists.')
    }

    // Duplicate check against previously registered accounts
    const existing = getRegisteredUsers()
    if (existing.find(r => r.user.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.')
    }

    const newUser = {
      id:               `u_${Date.now()}`,
      name:             trimmedName,
      email:            normalizedEmail,
      role:             'citizen',
      institutionId:    null,
      institution:      null,
      avatar:           trimmedName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      subscriptions:    [],
      savedEvents:      [],
      registeredEvents: [],
    }

    saveRegisteredUsers([...existing, { user: newUser, password }])
    return { user: newUser }
  }

  // ── Real backend ──
  // POST /auth/register → { user: User }
  return api.post('/auth/register', { name: trimmedName, email: normalizedEmail, password })
}

// ── User preference mutations ─────────────────────────────────────
// In mock mode these are no-ops — the mutations live in AuthContext state +
// localStorage.  When USE_MOCK is false they call the real REST endpoints so
// the backend can persist the change and the frontend state stays in sync.

/**
 * Add an event to the current user's saved list.
 * @param {number|string} eventId
 * Returns { success: true }.
 */
export async function saveEvent(eventId) {
  if (USE_MOCK) return { success: true }
  // POST /events/:id/save
  return api.post(`/events/${eventId}/save`)
}

/**
 * Remove an event from the current user's saved list.
 * @param {number|string} eventId
 * Returns { success: true }.
 */
export async function unsaveEvent(eventId) {
  if (USE_MOCK) return { success: true }
  // DELETE /events/:id/save
  return api.delete(`/events/${eventId}/save`)
}

/**
 * Register the current user for an event.
 * @param {number|string} eventId
 * Returns { success: true }.
 */
export async function registerForEvent(eventId) {
  if (USE_MOCK) return { success: true }
  // POST /events/:id/register
  return api.post(`/events/${eventId}/register`)
}

/**
 * Cancel the current user's registration for an event.
 * @param {number|string} eventId
 * Returns { success: true }.
 */
export async function unregisterFromEvent(eventId) {
  if (USE_MOCK) return { success: true }
  // DELETE /events/:id/register
  return api.delete(`/events/${eventId}/register`)
}

/**
 * Replace the current user's full subscription list.
 * @param {string[]} categories - Complete desired list (not a diff).
 * Returns { subscriptions: string[] }.
 */
export async function updateSubscriptions(categories) {
  if (USE_MOCK) return { subscriptions: categories }
  // PUT /user/subscriptions
  return api.put('/user/subscriptions', { categories })
}

/**
 * Provision a new institution admin account.
 * Only callable by super admins (enforced in the UI; backend should also
 * verify the caller's role via the Authorization header).
 *
 * Returns { user: User } on success; throws on validation error.
 *
 * Mock mode: persists to the same 'dajis_registered_users' store used by
 * citizen signup, so the new account works immediately on /login.
 * Backend mode: POST /auth/provision → { user: User }
 */
export async function createInstitutionAdmin(name, email, password, institution) {
  const normalizedEmail   = email.trim().toLowerCase()
  const trimmedName       = name.trim()
  const trimmedInstitution = institution.trim()

  if (USE_MOCK) {
    if (MOCK_CREDENTIALS[normalizedEmail]) {
      throw new Error('An account with this email already exists.')
    }
    const existing = getRegisteredUsers()
    if (existing.find(r => r.user.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.')
    }

    const now = new Date().toISOString()
    const newUser = {
      id:               `u_${Date.now()}`,
      name:             trimmedName,
      email:            normalizedEmail,
      role:             'institution_admin',
      institutionId:    null,
      institution:      trimmedInstitution,
      avatar:           trimmedName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      subscriptions:    [],
      savedEvents:      [],
      registeredEvents: [],
      // Extra fields so the user appears correctly in the admin Users table
      status:           'active',
      joinedAt:         now,
      eventsPublished:  0,
    }

    saveRegisteredUsers([...existing, { user: newUser, password }])
    return { user: newUser }
  }

  // ── Real backend ──
  // POST /auth/provision → { user: User }
  // The backend must verify the caller is a super_admin via JWT.
  return api.post('/auth/provision', {
    name: trimmedName,
    email: normalizedEmail,
    password,
    role: 'institution_admin',
    institution: trimmedInstitution,
  })
}
