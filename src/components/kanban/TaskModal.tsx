import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/ui/FormField'
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks'
import type { Task, TaskStatus } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
})

type FormData = z.infer<typeof schema>

interface TaskModalProps {
  open: boolean
  onClose: () => void
  task?: Task | null
  defaultStatus?: TaskStatus
}

const selectCls =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0'

export function TaskModal({ open, onClose, task, defaultStatus = 'todo' }: TaskModalProps) {
  const isEditing = !!task
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!open) return
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
      })
    } else {
      reset({ title: '', description: '', status: defaultStatus, priority: 'medium' })
    }
  }, [open, task, defaultStatus, reset])

  async function onSubmit({ title, description, status, priority }: FormData) {
    if (isEditing && task) {
      await updateTask.mutateAsync({
        id: task.id,
        input: { title, description: description || null, status, priority },
      })
    } else {
      await createTask.mutateAsync({
        title,
        description: description || undefined,
        status,
        priority,
      })
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar tarefa' : 'Nova tarefa'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Título" error={errors.title?.message}>
          <Input
            placeholder="Ex: Revisar documentação"
            autoFocus
            error={!!errors.title}
            {...register('title')}
          />
        </FormField>

        <FormField label="Descrição" error={errors.description?.message}>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0 resize-none"
            placeholder="Descrição opcional..."
            rows={3}
            {...register('description')}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Status" error={errors.status?.message}>
            <select className={selectCls} {...register('status')}>
              <option value="todo">A Fazer</option>
              <option value="in_progress">Em Progresso</option>
              <option value="done">Concluído</option>
            </select>
          </FormField>

          <FormField label="Prioridade" error={errors.priority?.message}>
            <select className={selectCls} {...register('priority')}>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </FormField>
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEditing ? 'Salvar alterações' : 'Criar tarefa'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
