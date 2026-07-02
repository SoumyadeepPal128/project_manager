import { useThemeStore } from "../store/themeStore"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-md border border-border text-ink-muted hover:text-ink hover:border-accent transition font-mono text-sm"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  )
}