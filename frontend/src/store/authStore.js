import { create } from "zustand"
import api from "../api/axios"

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // true until we've checked session on app load
  error: null,

  register: async ({ email, username, password, fullName }) => {
    set({ error: null })
    try {
      const res = await api.post("/auth/register", { email, username, password, fullName })
      return { success: true, data: res.data }
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed"
      set({ error: message })
      return { success: false, error: message }
    }
  },

  login: async ({ email, password }) => {
    set({ error: null })
    try {
      const res = await api.post("/auth/login", { email, password })
      const user = res.data.data.user
      set({ user, isAuthenticated: true })
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed"
      set({ error: message })
      return { success: false, error: message }
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout")
    } catch (err) {
      // even if the request fails, clear local state
    }
    set({ user: null, isAuthenticated: false })
  },

  getCurrentUser: async () => {
    set({ isLoading: true })
    try {
      const res = await api.get("/auth/current-user")
      set({ user: res.data.data, isAuthenticated: true, isLoading: false })
    } catch (err) {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))