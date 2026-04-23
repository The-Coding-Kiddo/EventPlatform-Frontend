/**
 * constants.js
 *
 * Static domain constants shared across the frontend.
 * These are not mock data — they represent configuration values that are
 * either hardcoded by design or will eventually come from a /meta endpoint.
 *
 * When connecting to the real backend you may want to fetch CATEGORIES and
 * CITIES from GET /meta/categories and GET /meta/cities respectively so
 * new values don't require a frontend deploy.
 */

export const CATEGORIES = [
  'Technology', 'Music', 'Arts & Culture', 'Sports', 'Business',
  'Food & Drink', 'Health & Wellness', 'Education', 'Community', 'Entertainment'
]

export const CITIES = [
  'New York', 'San Francisco', 'London', 'Paris', 'Tokyo',
  'Berlin', 'Sydney', 'Toronto', 'Dubai', 'Singapore'
]
