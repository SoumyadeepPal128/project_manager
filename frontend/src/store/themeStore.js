import { create } from "zustand"

const getInitialTheme = () => {
  const stored = localStorage.getItem("theme")
  if (stored) return stored
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

const applyTheme = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark")
  localStorage.setItem("theme", theme)
}

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  initTheme: () => applyTheme(get().theme),
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark"
    applyTheme(next)
    set({ theme: next })
  },
}))