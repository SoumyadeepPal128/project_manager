import { TaskStatusEnum } from "../constants"

export default function TaskCard({ task, onStatusChange, onDelete, onClick }) {
  const completedCount = task.subtasks?.filter((s) => s.isCompleted).length || 0
  const totalCount = task.subtasks?.length || 0

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex justify-between items-start gap-2">
        <p
          onClick={onClick}
          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-indigo-600"
        >
          {task.title}
        </p>
        <button
          onClick={() => onDelete(task._id)}
          className="text-gray-300 hover:text-red-500 text-xs shrink-0"
        >
          ✕
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
      )}
      {totalCount > 0 && (
        <p className="text-xs text-gray-400 mt-2">{completedCount}/{totalCount} subtasks</p>
      )}
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className="mt-2 w-full text-xs border border-gray-200 rounded-md px-2 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value={TaskStatusEnum.TODO}>To Do</option>
        <option value={TaskStatusEnum.IN_PROGRESS}>In Progress</option>
        <option value={TaskStatusEnum.DONE}>Done</option>
      </select>
    </div>
  )
}