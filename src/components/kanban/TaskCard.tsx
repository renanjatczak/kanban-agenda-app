import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
}

const priorityConfig = {
  low:    { label: 'Baixa',  cls: 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400' },
  medium: { label: 'Média',  cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  high:   { label: 'Alta',   cls: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' },
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform) }}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-3 shadow-sm group',
        'transition-shadow hover:shadow-md',
        isDragging && 'opacity-40 shadow-none',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-gray-300 dark:text-slate-600 hover:text-gray-500 dark:hover:text-slate-400 cursor-grab active:cursor-grabbing shrink-0 touch-none"
          aria-label="Arrastar tarefa"
        >
          <GripVertical className="size-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">{task.title}</p>
          {task.description && (
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="mt-2">
            <span className={cn('inline-block text-xs px-2 py-0.5 rounded-full font-medium', priorityConfig[task.priority].cls)}>
              {priorityConfig[task.priority].label}
            </span>
          </div>
        </div>

        <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded transition-colors"
            aria-label="Editar tarefa"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
            aria-label="Excluir tarefa"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-indigo-300 p-3 shadow-2xl rotate-1 w-72">
      <div className="flex items-start gap-2">
        <GripVertical className="size-4 text-gray-300 dark:text-slate-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
          {task.description && (
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-1">{task.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
