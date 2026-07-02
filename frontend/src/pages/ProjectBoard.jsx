import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useTaskStore } from "../store/taskStore"
import TaskCard from "../components/TaskCard"
import CreateTaskModal from "../components/CreateTaskModal"
import TaskModal from "../components/TaskModal"
import ThemeToggle from "../components/ThemeToggle"
import { TaskStatusEnum } from "../constants"

const COLUMNS = [
  { key: TaskStatusEnum.TODO, label: "To Do", index: "01" },
  { key: TaskStatusEnum.IN_PROGRESS, label: "In Progress", index: "02" },
  { key: TaskStatusEnum.DONE, label: "Done", index: "03" },
]

export default function ProjectBoard() {
  const { projectId } = useParams()
  const { tasks, isLoading, error, fetchTasks, updateTaskStatus, deleteTask } = useTaskStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState(null)

  useEffect(() => {
    fetchTasks(projectId)
  }, [projectId])

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/" className="font-mono text-xs text-ink-muted hover:text-accent transition">
              ← projects
            </Link>
            <h1 className="text-xl font-semibold text-ink mt-1">Project Board</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to={`/projects/${projectId}/members`}
              className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink rounded-md border border-border transition"
            >
              Members
            </Link>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 text-sm font-medium bg-accent text-accent-fg rounded-md hover:bg-accent-hover transition"
            >
              + New Task
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-danger/10 border border-danger/30 text-danger text-sm px-3 py-2">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="font-mono text-sm text-ink-muted">loading tasks...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMNS.map((col) => (
              <div key={col.key} className="bg-bg-subtle border border-border rounded-lg p-3">
                <h2 className="flex items-baseline gap-2 mb-3 px-1">
                  <span className="font-mono text-xs text-ink-muted">—{col.index}</span>
                  <span className="text-sm font-semibold text-ink">{col.label}</span>
                  <span className="font-mono text-xs text-ink-muted ml-auto">
                    {tasks.filter((t) => t.status === col.key).length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {tasks
                    .filter((t) => t.status === col.key)
                    .map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onStatusChange={(taskId, status) => updateTaskStatus(projectId, taskId, status)}
                        onDelete={(taskId) => deleteTask(projectId, taskId)}
                        onClick={() => setActiveTaskId(task._id)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} projectId={projectId} />
      {activeTaskId && (
        <TaskModal projectId={projectId} taskId={activeTaskId} onClose={() => setActiveTaskId(null)} />
      )}
    </div>
  )
}