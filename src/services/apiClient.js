/**
 * apiClient.js
 *
 * Thin fetch-based HTTP client. No external dependencies.
 * When you are ready to switch to a real backend:
 *   1. Set VITE_API_URL in your .env file
 *   2. Set VITE_USE_MOCK=false
 *
 * All service functions (authService, eventService, etc.) check USE_MOCK first,
 * so flipping that flag is the only change needed to go live.
 */

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/**
 * USE_MOCK — true while no backend is available.
 * Set VITE_USE_MOCK=false in .env to switch to real API calls.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

// ── Token storage ────────────────────────────────────────────────
export const tokenStore = {
  get:   ()      => localStorage.getItem('es_auth_token'),
  set:   (token) => localStorage.setItem('es_auth_token', token),
  clear: ()      => localStorage.removeItem('es_auth_token'),
}

// ── Core request function ────────────────────────────────────────
async function request(method, path, { body, params } = {}) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
  const token = tokenStore.get()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const url = new URL(BASE_URL + path)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  // Handle auth errors globally
  if (res.status === 401) {
    tokenStore.clear()
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    throw new ApiError('Session expired. Please sign in again.', 401)
  }
  if (res.status === 403) {
    throw new ApiError('You do not have permission to do this.', 403)
  }

  // Try to parse JSON body for both success and error responses
  let data
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    data = await res.json()
  }

  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status, data)
  }

  return data
}

// ── Public API ────────────────────────────────────────────────────
export const api = {
  get:    (path, params)  => request('GET',    path, { params }),
  post:   (path, body)    => request('POST',   path, { body }),
  put:    (path, body)    => request('PUT',    path, { body }),
  patch:  (path, body)    => request('PATCH',  path, { body }),
  delete: (path)          => request('DELETE', path),
}

// ── ApiError class ────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name    = 'ApiError'
    this.status  = status
    this.data    = data
  }
}
