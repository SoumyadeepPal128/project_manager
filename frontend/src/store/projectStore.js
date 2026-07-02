import { create } from "zustand"
import api from "../api/axios"

export const useProjectStore = create((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get("/project")
      set({ projects: res.data.data, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to load projects", isLoading: false })
    }
  },

  createProject: async ({ name, description }) => {
    try {
      const res = await api.post("/project", { name, description })
      // refetch so the new project shows up with correct shape (role, members count, etc.)
      await get().fetchProjects()
      return { success: true, data: res.data.data }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create project"
      set({ error: message })
      return { success: false, error: message }
    }
  },

  deleteProject: async (projectId) => {
    try {
      await api.delete(`/project/${projectId}`)
      set({ projects: get().projects.filter((p) => p.projects._id !== projectId) })
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete project"
      set({ error: message })
      return { success: false, error: message }
    }
  },
}))