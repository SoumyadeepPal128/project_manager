import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useTaskStore } from "../store/taskStore"
import TaskCard from "../components/TaskCard"
import CreateTaskModal from "../components/CreateTaskModal"
import TaskModal from "../components/TaskModal"
import { TaskStatusEnum } from "../constants"

const COLUMNS = [
  { key: TaskStatusEnum.TODO, label: "To Do" },
  { key: TaskStatusEnum.IN_PROGRESS, label: "In Progress" },
  { key: TaskStatusEnum.DONE, label: "Done" },
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to="/" className="text-sm text-indigo-600 hover:underline">← Back to projects</Link>
            <h1 className="text-xl font-semibold text-gray-900 mt-1">Project Board</h1>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/projects/${projectId}/members`}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md border border-gray-200"
            >
              Members
            </Link>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              + New Task
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMNS.map((col) => (
              <div key={col.key} className="bg-gray-100 rounded-xl p-3">
                <h2 className="text-sm font-semibold text-gray-600 mb-3 px-1">
                  {col.label}{" "}
                  <span className="text-gray-400 font-normal">
                    ({tasks.filter((t) => t.status === col.key).length})
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