import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, parseISO } from 'date-fns'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/ui/FormField'
import { useCreateEvent, useUpdateEvent } from '@/hooks/useEvents'
import { useTasks } from '@/hooks/useTasks'
import { PRESET_COLORS, EVENT_TYPE_LABELS } from '@/utils/eventColors'
import { cn } from '@/lib/utils'
import type { Event } from '@/types'

const schema = z
  .object({
    title: z.string().min(1, 'Título é obrigatório').max(100),
    description: z.string().max(500).optional(),
    start_time: z.string().min(1, 'Data/hora inicial obrigatória'),
    end_time: z.string().min(1, 'Data/hora final obrigatória'),
    type: z.enum(['meeting', 'focus', 'reminder', 'personal']),
    status: z.enum(['confirmed', 'cancelled']),
    color: z.string().optional(),
    task_id: z.string().optional(),
  })
  .refine((d) => new Date(d.end_time) > new Date(d.start_time), {
    message: 'Horário final deve ser posterior ao inicial',
    path: ['end_time'],
  })

type FormData = z.infer<typeof schema>

interface EventFormModalProps {
  open: boolean
  onClose: () => void
  event?: Event | null
  defaultDate?: Date | null
}

const selectCls =
  'w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0'

function toInputDate(isoString: string): string {
  return format(parseISO(isoString), "yyyy-MM-dd'T'HH:mm")
}

function defaultStart(date: Date): string {
  const d = new Date(date)
  d.setHours(9, 0, 0, 0)
  return format(d, "yyyy-MM-dd'T'HH:mm")
}

function defaultEnd(date: Date): string {
  const d = new Date(date)
  d.setHours(10, 0, 0, 0)
  return format(d, "yyyy-MM-dd'T'HH:mm")
}

export function EventFormModal({ open, onClose, event, defaultDate }: EventFormModalProps) {
  const isEditing = !!event
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const { data: tasks = [] } = useTasks()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const selectedColor = useWatch({ control, name: 'color' }) ?? PRESET_COLORS[0]

  useEffect(() => {
    if (!open) return
    const base = defaultDate ?? new Date()
    if (event) {
      reset({
        title: event.title,
        description: event.description ?? '',
        start_time: toInputDate(event.start_time),
        end_time: toInputDate(event.end_time),
        type: event.type,
        status: event.status,
        color: event.color ?? PRESET_COLORS[0],
        task_id: event.task_id ?? '',
      })
    } else {
      reset({
        title: '',
        description: '',
        start_time: defaultStart(base),
        end_time: defaultEnd(base),
        type: 'meeting',
        status: 'confirmed',
        color: PRESET_COLORS[0],
        task_id: '',
      })
    }
  }, [open, event, defaultDate, reset])

  async function onSubmit({ title, description, start_time, end_time, type, status, color, task_id }: FormData) {
    const payload = {
      title,
      description: description || undefined,
      start_time: new Date(start_time).toISOString(),
      end_time: new Date(end_time).toISOString(),
      type,
      status,
      color: color || undefined,
      task_id: task_id || undefined,
    }
    if (isEditing && event) {
      await updateEvent.mutateAsync({ id: event.id, input: payload })
    } else {
      await createEvent.mutateAsync(payload)
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Editar evento' : 'Novo evento'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Título" error={errors.title?.message}>
          <Input placeholder="Ex: Reunião de equipe" autoFocus error={!!errors.title} {...register('title')} />
        </FormField>

        <FormField label="Descrição" error={errors.description?.message}>
          <textarea
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0 resize-none"
            placeholder="Descrição opcional..."
            rows={2}
            {...register('description')}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Início" error={errors.start_time?.message}>
            <Input type="datetime-local" error={!!errors.start_time} {...register('start_time')} />
          </FormField>
          <FormField label="Fim" error={errors.end_time?.message}>
            <Input type="datetime-local" error={!!errors.end_time} {...register('end_time')} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Tipo" error={errors.type?.message}>
            <select className={selectCls} {...register('type')}>
              {(Object.keys(EVENT_TYPE_LABELS) as Array<keyof typeof EVENT_TYPE_LABELS>).map((k) => (
                <option key={k} value={k}>{EVENT_TYPE_LABELS[k]}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Status" error={errors.status?.message}>
            <select className={selectCls} {...register('status')}>
              <option value="confirmed">Confirmado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </FormField>
        </div>

        <FormField label="Tarefa vinculada">
          <select className={selectCls} {...register('task_id')}>
            <option value="">Nenhuma tarefa</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Cor">
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color)}
                className={cn(
                  'size-7 rounded-full transition-transform hover:scale-110 border-2',
                  selectedColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent',
                )}
                style={{ backgroundColor: color }}
                aria-label={color}
              />
            ))}
          </div>
        </FormField>

        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>
            {isEditing ? 'Salvar alterações' : 'Criar evento'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
