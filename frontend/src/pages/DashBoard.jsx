import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { useProjectStore } from "../store/projectStore"
import CreateProjectModal from "../components/CreateProjectModal"
import ThemeToggle from "../components/ThemeToggle"

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const { projects, isLoading, error, fetchProjects, deleteProject } = useProjectStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="font-mono text-xs text-ink-muted uppercase tracking-wider mb-1">Dashboard</p>
            <h1 className="text-2xl font-semibold text-ink">Welcome, {user?.username}</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium bg-accent text-accent-fg rounded-md hover:bg-accent-hover transition"
            >
              + New Project
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink transition"
            >
              Log out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-danger/10 border border-danger/30 text-danger text-sm px-3 py-2">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="font-mono text-sm text-ink-muted">loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <p className="text-ink-muted mb-3">No projects yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-accent text-sm font-medium hover:underline"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(({ projects: project, role }, i) => (
              <div
                key={project._id}
                className="bg-surface border border-border rounded-lg p-5 hover:border-accent/50 transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-xs text-ink-muted">
                    —{String(i + 1).padStart(2, "0")}
                  </span>
                  {role === "admin" && (
                    <button
                      onClick={() => deleteProject(project._id)}
                      className="text-ink-muted hover:text-danger text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Link
                  to={`/projects/${project._id}`}
                  className="block font-medium text-ink hover:text-accent transition mb-1"
                >
                  {project.name}
                </Link>
                <p className="text-sm text-ink-muted mb-4 line-clamp-2">
                  {project.description || "No description"}
                </p>
                <div className="flex justify-between text-xs font-mono text-ink-muted pt-3 border-t border-border">
                  <span>{project.members} member{project.members !== 1 ? "s" : ""}</span>
                  <span className="uppercase">{role}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}