import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  id: TaskStatus
  label: string
  tasks: Task[]
  onCreateTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}

const columnStyles: Record<TaskStatus, { bg: string; border: string; badge: string }> = {
  todo: {
    bg: 'bg-slate-50 dark:bg-slate-800/60',
    border: 'border-slate-200 dark:border-slate-700',
    badge: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  },
  in_progress: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-900',
    badge: 'bg-blue-200 text-blue-700 dark:bg-blue-900/60 dark:text-blue-400',
  },
  done: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-900',
    badge: 'bg-emerald-200 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-400',
  },
}

const labelStyles: Record<TaskStatus, string> = {
  todo: 'text-slate-700 dark:text-slate-200',
  in_progress: 'text-blue-700 dark:text-blue-400',
  done: 'text-emerald-700 dark:text-emerald-400',
}

export function KanbanColumn({ id, label, tasks, onCreateTask, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const styles = columnStyles[id]

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border p-3 w-72 shrink-0 min-w-[260px]',
        styles.bg, styles.border,
        isOver && 'ring-2 ring-indigo-400 ring-offset-1',
        'transition-all duration-150',
      )}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-semibold', labelStyles[id])}>{label}</span>
          <span className={cn('text-xs rounded-full px-1.5 py-0.5 font-mono font-medium', styles.badge)}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onCreateTask}
          className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-md p-1 transition-colors"
          aria-label={`Nova tarefa em ${label}`}
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-2 min-h-24 rounded-lg transition-colors',
          isOver && 'bg-indigo-50/60 dark:bg-indigo-950/20',
        )}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-gray-300 dark:border-slate-600 text-xs text-gray-400 dark:text-slate-500">
            Sem tarefas
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task)}
            />
          ))
        )}
      </div>
    </div>
  )
}
