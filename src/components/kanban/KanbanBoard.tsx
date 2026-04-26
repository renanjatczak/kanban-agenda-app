import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { Plus, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTasks, useUpdateTaskStatus, useDeleteTask } from '@/hooks/useTasks'
import { KanbanColumn } from './KanbanColumn'
import { TaskCardOverlay } from './TaskCard'
import { TaskModal } from './TaskModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import type { Task, TaskStatus } from '@/types'

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'A Fazer' },
  { id: 'in_progress', label: 'Em Progresso' },
  { id: 'done', label: 'Concluído' },
]

const VALID_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done']

export function KanbanBoard() {
  const { data: tasks = [], isLoading, error } = useTasks()
  const updateStatus = useUpdateTaskStatus()
  const deleteTask = useDeleteTask()

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo')
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function openCreate(status: TaskStatus = 'todo') {
    setEditingTask(null)
    setDefaultStatus(status)
    setModalOpen(true)
  }

  function openEdit(task: Task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingTask(null)
  }

  function onDragStart({ active }: DragStartEvent) {
    const task = tasks.find((t) => t.id === active.id)
    setActiveTask(task ?? null)
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null)
    if (!over) return

    const newStatus = String(over.id) as TaskStatus
    if (!VALID_STATUSES.includes(newStatus)) return

    const task = tasks.find((t) => t.id === active.id)
    if (!task || task.status === newStatus) return

    updateStatus.mutate({ id: task.id, status: newStatus })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    deleteTask.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 text-indigo-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="size-4 shrink-0" />
          <p className="text-sm font-medium">Erro ao carregar tarefas</p>
        </div>
        <p className="text-xs text-red-500 font-mono break-all">{msg}</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {tasks.length === 0
            ? 'Nenhuma tarefa ainda. Crie a primeira!'
            : `${tasks.length} tarefa${tasks.length !== 1 ? 's' : ''} no total`}
        </p>
        <button
          onClick={() => openCreate()}
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-medium',
            'bg-indigo-600 text-white rounded-lg px-3 py-2',
            'hover:bg-indigo-700 transition-colors',
          )}
        >
          <Plus className="size-4" />
          Nova tarefa
        </button>
      </div>

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              label={col.label}
              tasks={tasks.filter((t) => t.status === col.id)}
              onCreateTask={() => openCreate(col.id)}
              onEditTask={openEdit}
              onDeleteTask={(task) => setDeleteTarget(task)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCardOverlay task={activeTask} />}
        </DragOverlay>
      </DndContext>

      <TaskModal
        open={modalOpen}
        onClose={closeModal}
        task={editingTask}
        defaultStatus={defaultStatus}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        taskTitle={deleteTarget?.title ?? ''}
        isLoading={deleteTask.isPending}
      />
    </>
  )
}
