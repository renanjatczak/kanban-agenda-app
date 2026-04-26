import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { CalendarDays, Clock, Tag, CheckCircle, Pencil, Trash2, Link } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useTasks } from '@/hooks/useTasks'
import { useDeleteEvent } from '@/hooks/useEvents'
import { EVENT_TYPE_LABELS } from '@/utils/eventColors'
import type { Event } from '@/types'

interface EventDetailModalProps {
  event: Event | null
  onClose: () => void
  onEdit: (event: Event) => void
}

const statusLabel = { confirmed: 'Confirmado', cancelled: 'Cancelado' }
const statusCls = {
  confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  cancelled: 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400',
}

export function EventDetailModal({ event, onClose, onEdit }: EventDetailModalProps) {
  const [confirming, setConfirming] = useState(false)
  const deleteEvent = useDeleteEvent()
  const { data: tasks = [] } = useTasks()

  if (!event) return null

  const linkedTask = event.task_id ? tasks.find((t) => t.id === event.task_id) : null
  const startDate = parseISO(event.start_time)
  const endDate = parseISO(event.end_time)
  const sameDay = format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')

  const dateStr = sameDay
    ? format(startDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : `${format(startDate, "d 'de' MMM", { locale: ptBR })} – ${format(endDate, "d 'de' MMM 'de' yyyy", { locale: ptBR })}`

  const timeStr = `${format(startDate, 'HH:mm')} – ${format(endDate, 'HH:mm')}`

  function handleDelete() {
    deleteEvent.mutate(event!.id, { onSuccess: onClose })
  }

  return (
    <Modal open={!!event} onClose={onClose} title="Detalhes do evento">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span
            className="size-4 rounded-full mt-1 shrink-0"
            style={{ backgroundColor: event.color ?? '#6366f1' }}
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
              {event.title}
            </h4>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
                <Tag className="size-3" />
                {EVENT_TYPE_LABELS[event.type]}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusCls[event.status]}`}>
                <CheckCircle className="size-3" />
                {statusLabel[event.status]}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pl-7">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
            <CalendarDays className="size-4 shrink-0 text-gray-400 dark:text-slate-500" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
            <Clock className="size-4 shrink-0 text-gray-400 dark:text-slate-500" />
            <span>{timeStr}</span>
          </div>
          {linkedTask && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
              <Link className="size-4 shrink-0 text-gray-400 dark:text-slate-500" />
              <span className="truncate">{linkedTask.title}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-3 py-2.5 leading-relaxed">
            {event.description}
          </p>
        )}

        <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
          {confirming ? (
            <div className="space-y-2">
              <p className="text-sm text-red-600 dark:text-red-400">Tem certeza que deseja excluir este evento?</p>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" loading={deleteEvent.isPending} onClick={handleDelete}>
                  Confirmar exclusão
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { onClose(); onEdit(event) }}
              >
                <Pencil className="size-3.5" />
                Editar
              </Button>
              <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
                <Trash2 className="size-3.5" />
                Excluir
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
