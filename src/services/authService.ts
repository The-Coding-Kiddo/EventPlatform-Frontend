import api from "./api"

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post("/auth/login", credentials)
    // Handle TransformInterceptor envelope if present
    const payload = response.data?.data || response.data || response
    if (payload.token) {
      localStorage.setItem("token", payload.token)
    }
    return payload
  },
  register: async (userData: any) => {
    const payload = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
    }
    const response = await api.post("/auth/register", payload)
    return response.data
  },
  logout: () => {
    localStorage.removeItem("token")
  },
  me: async () => {
    const response = await api.get("/auth/me")
    return response.data?.data || response.data || response
  }
}
