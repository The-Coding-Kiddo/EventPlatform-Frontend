/**
 * storage.js — thin localStorage wrapper.
 *
 * All keys are namespaced under "dajis_" to avoid collisions.
 * Replacing these three functions with API calls later is
 * the only change needed to remove the localStorage layer.
 */

const PREFIX = 'dajis_'

/**
 * Read and parse a value.
 * Returns `fallback` (default null) when the key is absent or JSON is corrupt.
 * Returns the stored value (including [] or {}) when the key exists.
 */
export function storageGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/** Serialize and store a value. Silent on quota/security errors. */
export function storageSet(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch { /* quota exceeded or private-browsing restriction */ }
}

/** Remove a key. */
export function storageRemove(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {}
}
