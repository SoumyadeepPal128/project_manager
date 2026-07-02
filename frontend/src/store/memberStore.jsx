import { create } from "zustand"
import api from "../api/axios"

export const useMemberStore = create((set, get) => ({
  members: [],
  isLoading: false,
  error: null,

  fetchMembers: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get(`/project/${projectId}/members`)
      set({ members: res.data.data, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to load members", isLoading: false })
    }
  },

  addMember: async (projectId, { email, role }) => {
    try {
      await api.post(`/project/${projectId}/members`, { email, role })
      await get().fetchMembers(projectId)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add member"
      set({ error: message })
      return { success: false, error: message }
    }
  },
}))