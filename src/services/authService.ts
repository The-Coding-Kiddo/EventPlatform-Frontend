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
    const payload: any = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
    }
    if (userData.role === 'institution') {
      payload.institution = userData.institutionName
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
  },
  updateProfile: async (data: { name?: string; email?: string; bio?: string }) => {
    const response = await api.patch("/user/profile", data)
    return response.data?.data || response.data || response
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.patch("/user/password", data)
    return response.data?.data || response.data || response
  }
}
