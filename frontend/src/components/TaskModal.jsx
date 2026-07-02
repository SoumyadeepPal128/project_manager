import { useEffect, useState } from "react"
import { useTaskStore } from "../store/taskStore"

export default function TaskModal({ projectId, taskId, onClose }) {
  const { activeTask, fetchTaskById, clearActiveTask, addSubtask, toggleSubtask, deleteSubtask } = useTaskStore()
  const [newSubtask, setNewSubtask] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchTaskById(projectId, taskId)
    return () => clearActiveTask()
  }, [taskId])

  if (!activeTask) return null

  const handleAddSubtask = async (e) => {
    e.preventDefault()
    if (!newSubtask.trim()) return
    setIsAdding(true)
    await addSubtask(projectId, taskId, newSubtask.trim())
    setNewSubtask("")
    setIsAdding(false)
  }

  const completedCount = activeTask.subtasks?.filter((s) => s.isCompleted).length || 0
  const totalCount = activeTask.subtasks?.length || 0

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-lg font-semibold text-gray-900">{activeTask.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        {activeTask.description && (
          <p className="text-sm text-gray-500 mb-4">{activeTask.description}</p>
        )}

        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Subtasks {totalCount > 0 && <span className="text-gray-400 font-normal">({completedCount}/{totalCount})</span>}
          </h3>

          <div className="space-y-2 mb-3">
            {activeTask.subtasks?.map((subtask) => (
              <div key={subtask._id} className="flex items-center gap-2 group">
                <input
                  type="checkbox"
                  checked={subtask.isCompleted}
                  onChange={(e) => toggleSubtask(projectId, subtask._id, e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className={`text-sm flex-1 ${subtask.isCompleted ? "line-through text-gray-400" : "text-gray-700"}`}>
                  {subtask.title}
                </span>
                <button
                  onClick={() => deleteSubtask(projectId, subtask._id)}
                  className="text-gray-300 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
            {totalCount === 0 && <p className="text-sm text-gray-400">No subtasks yet</p>}
          </div>

          <form onSubmit={handleAddSubtask} className="flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add a subtask..."
              className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isAdding}
              className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}