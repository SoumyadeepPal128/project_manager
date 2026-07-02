import { create } from "zustand"
import api from "../api/axios"

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get(`/tasks/${projectId}`)
      set({ tasks: res.data.data, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to load tasks", isLoading: false })
    }
  },

  createTask: async (projectId, { title, description, status }) => {
    try {
      const res = await api.post(`/tasks/${projectId}`, { title, description, status })
      set({ tasks: [...get().tasks, res.data.data] })
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create task"
      set({ error: message })
      return { success: false, error: message }
    }
  },

  updateTaskStatus: async (projectId, taskId, status) => {
    // optimistic update
    const previousTasks = get().tasks
    set({
      tasks: get().tasks.map((t) => (t._id === taskId ? { ...t, status } : t)),
    })
    try {
      await api.put(`/tasks/${projectId}/t/${taskId}`, { status })
    } catch (err) {
      // rollback on failure
      set({ tasks: previousTasks, error: "Failed to update task status" })
    }
  },

  deleteTask: async (projectId, taskId) => {
    try {
      await api.delete(`/tasks/${projectId}/t/${taskId}`)
      set({ tasks: get().tasks.filter((t) => t._id !== taskId) })
      return { success: true }
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to delete task" })
      return { success: false }
    }
  },

  addSubtask: async (projectId, taskId, title) => {
    try {
      const res = await api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, { title })
      set({
        tasks: get().tasks.map((t) =>
          t._id === taskId ? { ...t, subtasks: [...(t.subtasks || []), res.data.data] } : t
        ),
      })
      return { success: true }
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to add subtask" })
      return { success: false }
    }
  },

  

  // ...existing fetchTasks, createTask, updateTaskStatus, deleteTask stay unchanged...

  fetchTaskById: async (projectId, taskId) => {
    try {
      const res = await api.get(`/tasks/${projectId}/t/${taskId}`)
      set({ activeTask: res.data.data })
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to load task" })
    }
  },

  clearActiveTask: () => set({ activeTask: null }),

  addSubtask: async (projectId, taskId, title) => {
    try {
      const res = await api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, { title })
      set({
        activeTask: {
          ...get().activeTask,
          subtasks: [...(get().activeTask?.subtasks || []), res.data.data],
        },
      })
      return { success: true }
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to add subtask" })
      return { success: false }
    }
  },

  toggleSubtask: async (projectId, subtaskId, isCompleted) => {
    const previous = get().activeTask
    set({
      activeTask: {
        ...previous,
        subtasks: previous.subtasks.map((s) =>
          s._id === subtaskId ? { ...s, isCompleted } : s
        ),
      },
    })
    try {
      await api.put(`/tasks/${projectId}/st/${subtaskId}`, { isCompleted })
    } catch (err) {
      set({ activeTask: previous, error: "Failed to update subtask" })
    }
  },

  deleteSubtask: async (projectId, subtaskId) => {
    const previous = get().activeTask
    set({
      activeTask: {
        ...previous,
        subtasks: previous.subtasks.filter((s) => s._id !== subtaskId),
      },
    })
    try {
      await api.delete(`/tasks/${projectId}/st/${subtaskId}`)
    } catch (err) {
      set({ activeTask: previous, error: "Failed to delete subtask" })
    }
  },
}))