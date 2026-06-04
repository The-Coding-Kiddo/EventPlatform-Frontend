import api from "./api"

export type EventStatus = "draft" | "pending" | "approved" | "rejected"

export type Event = {
  id: string
  title: string
  category: string
  date: string
  time: string
  location: string
  venue: string
  institution: string
  description: string
  price: number
  capacity: number
  attendees: number
  tags: string[]
  image?: string
  status: EventStatus
}

export const eventService = {
  getPublicEvents: async (params?: { category?: string; city?: string; search?: string; page?: number; limit?: number }) => {
    const response = await api.get("/events", { params })
    return response.data
  },
  getAllEvents: async (params?: { institutionId?: string; page?: number; limit?: number }) => {
    const response = await api.get("/events/all", { params })
    return response.data
  },
  getEventById: async (id: string) => {
    const response = await api.get(`/events/${id}`)
    return response.data?.data || response.data
  },
  submitEvent: async (eventData: any) => {
    const response = await api.post("/events", eventData)
    return response.data
  },
  saveDraft: async (eventData: any) => {
    const response = await api.post("/events/draft", eventData)
    return response.data
  },
  updateEvent: async (id: string, eventData: any) => {
    const response = await api.put(`/events/${id}`, eventData)
    return response.data
  },
  deleteEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}`)
    return response.data
  },
  saveEvent: async (id: string) => {
    const response = await api.post(`/events/${id}/save`)
    return response.data
  },
  unsaveEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}/save`)
    return response.data
  },
  registerForEvent: async (id: string) => {
    const response = await api.post(`/events/${id}/register`)
    return response.data
  },
  cancelRegistration: async (id: string) => {
    const response = await api.delete(`/events/${id}/register`)
    return response.data
  },
  getAttendees: async (id: string) => {
    const response = await api.get(`/events/${id}/attendees`)
    return response.data?.data || response.data
  },
  inviteAttendee: async (id: string, data: { email: string; name?: string }) => {
    const response = await api.post(`/events/${id}/invite-attendee`, data)
    return response.data
  },
  getAnalytics: async () => {
    const response = await api.get("/admin/analytics")
    return response.data?.data || response.data
  },
  getUsers: async (params?: { skip?: number; take?: number }) => {
    const response = await api.get("/admin/users", { params })
    return response.data?.data || response.data
  },
  updateUserStatus: async (id: string, status: 'active' | 'suspended') => {
    const response = await api.patch(`/admin/users/${id}`, { status })
    return response.data?.data || response.data
  },
}
