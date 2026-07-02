import { TaskStatusEnum } from "../constants"

const statusBorderClass = {
  [TaskStatusEnum.TODO]: "border-l-status-todo",
  [TaskStatusEnum.IN_PROGRESS]: "border-l-status-progress",
  [TaskStatusEnum.DONE]: "border-l-status-done",
}

export default function TaskCard({ task, onStatusChange, onDelete, onClick }) {
  const completedCount = task.subtasks?.filter((s) => s.isCompleted).length || 0
  const totalCount = task.subtasks?.length || 0

  return (
    <div className={`bg-surface border border-border border-l-[3px] ${statusBorderClass[task.status]} rounded-md p-3`}>
      <div className="flex justify-between items-start gap-2">
        <p
          onClick={onClick}
          className="text-sm font-medium text-ink cursor-pointer hover:text-accent transition"
        >
          {task.title}
        </p>
        <button
          onClick={() => onDelete(task._id)}
          className="text-ink-muted hover:text-danger text-xs shrink-0"
        >
          ✕
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-ink-muted mt-1 line-clamp-2">{task.description}</p>
      )}
      {totalCount > 0 && (
        <p className="font-mono text-xs text-ink-muted mt-2">{completedCount}/{totalCount} subtasks</p>
      )}
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className="mt-2 w-full font-mono text-xs border border-border rounded px-2 py-1 bg-bg-subtle text-ink focus:outline-none focus:ring-1 focus:ring-accent"
      >
        <option value={TaskStatusEnum.TODO}>To Do</option>
        <option value={TaskStatusEnum.IN_PROGRESS}>In Progress</option>
        <option value={TaskStatusEnum.DONE}>Done</option>
      </select>
    </div>
  )
}