import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { useProjectStore } from "../store/projectStore"
import CreateProjectModal from "../components/CreateProjectModal"

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const { projects, isLoading, error, fetchProjects, deleteProject } = useProjectStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Welcome, {user?.username}</h1>
            <p className="text-sm text-gray-500">Your projects</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              + New Project
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Log out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500 mb-3">No projects yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(({ projects: project, role }) => (
              <div
                key={project._id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <Link
                    to={`/projects/${project._id}`}
                    className="font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {project.name}
                  </Link>
                  {role === "admin" && (
                    <button
                      onClick={() => deleteProject(project._id)}
                      className="text-gray-400 hover:text-red-500 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {project.description || "No description"}
                </p>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{project.members} member{project.members !== 1 ? "s" : ""}</span>
                  <span className="capitalize">{role}</span>
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