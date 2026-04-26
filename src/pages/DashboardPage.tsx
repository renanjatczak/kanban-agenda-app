import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Columns3, CalendarDays, Clock } from 'lucide-react'
import { parseISO, format, isToday, isTomorrow, startOfDay, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useEvents } from '@/hooks/useEvents'
import { EVENT_TYPE_LABELS } from '@/utils/eventColors'
import { EventDetailModal } from '@/components/calendar/EventDetailModal'
import { EventFormModal } from '@/components/calendar/EventFormModal'
import type { Event, EventType } from '@/types'

function isAllDayEvent(event: Event): boolean {
  const start = parseISO(event.start_time)
  const end = parseISO(event.end_time)
  return (
    start.getHours() === 0 &&
    start.getMinutes() === 0 &&
    end.getHours() === 23 &&
    end.getMinutes() >= 58
  )
}

function formatEventDate(event: Event): string {
  const start = parseISO(event.start_time)
  const allDay = isAllDayEvent(event)
  const suffix = allDay ? 'Dia inteiro' : format(start, 'HH:mm')

  if (isToday(start)) return `Hoje • ${suffix}`
  if (isTomorrow(start)) return `Amanhã • ${suffix}`
  const raw = format(start, "d 'de' MMM", { locale: ptBR })
  return `${raw} • ${suffix}`
}

const MAX_UPCOMING = 5

export function DashboardPage() {
  const { user } = useAuth()
  const { data: tasks = [], isLoading: tasksLoading } = useTasks()

  const rangeStart = useMemo(() => startOfDay(new Date()), [])
  const rangeEnd = useMemo(() => addDays(new Date(), 30), [])
  const { data: allEvents = [], isLoading: eventsLoading } = useEvents(rangeStart, rangeEnd)

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const todo = tasks.filter((t) => t.status === 'todo').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const done = tasks.filter((t) => t.status === 'done').length

  const upcomingEvents = useMemo(
    () =>
      allEvents
        .filter((e) => e.status === 'confirmed')
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
        .slice(0, MAX_UPCOMING),
    [allEvents],
  )

  const stats = [
    { label: 'A Fazer', value: todo, color: 'text-slate-700 dark:text-slate-200' },
    { label: 'Em Progresso', value: inProgress, color: 'text-blue-700 dark:text-blue-400' },
    { label: 'Concluídas', value: done, color: 'text-emerald-700 dark:text-emerald-400' },
  ]

  function handleEditFromDashboard(event: Event) {
    setSelectedEvent(null)
    setEditingEvent(event)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Olá, {user?.email?.split('@')[0]} 👋
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
          Aqui está um resumo das suas tarefas e eventos.
        </p>
      </div>

      {/* Task stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5"
          >
            <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>
              {tasksLoading ? '—' : value}
            </p>
          </div>
        ))}
      </div>

      {/* Empty state for tasks */}
      {!tasksLoading && tasks.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 text-center space-y-3">
          <div className="size-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center mx-auto">
            <Columns3 className="size-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Nenhuma tarefa ainda</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">Crie sua primeira tarefa no board Kanban.</p>
          <Link
            to="/app/kanban"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Ir para o Kanban
          </Link>
        </div>
      )}

      {/* Upcoming events */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Próximos eventos</p>
          <Link
            to="/app/calendar"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Ver agenda
          </Link>
        </div>

        {eventsLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 rounded-lg bg-gray-100 dark:bg-slate-700 animate-pulse"
              />
            ))}
          </div>
        )}

        {!eventsLoading && upcomingEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <CalendarDays className="size-8 text-gray-300 dark:text-slate-600" />
            <p className="text-sm text-gray-400 dark:text-slate-500">
              Nenhum evento nos próximos 30 dias
            </p>
            <Link
              to="/app/calendar"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium mt-1"
            >
              Criar evento
            </Link>
          </div>
        )}

        {!eventsLoading && upcomingEvents.length > 0 && (
          <div className="space-y-2">
            {upcomingEvents.map((event) => {
              const linkedTask = event.task_id
                ? tasks.find((t) => t.id === event.task_id)
                : null

              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors text-left group"
                >
                  <span
                    className="size-2.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: event.color ?? '#6366f1' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
                        <Clock className="size-3" />
                        {formatEventDate(event)}
                      </span>
                      <span className="text-xs text-gray-300 dark:text-slate-600">·</span>
                      <span className="text-xs text-gray-400 dark:text-slate-500">
                        {EVENT_TYPE_LABELS[event.type as EventType]}
                      </span>
                      {linkedTask && (
                        <>
                          <span className="text-xs text-gray-300 dark:text-slate-600">·</span>
                          <span className="text-xs text-gray-400 dark:text-slate-500 truncate max-w-[120px]">
                            {linkedTask.title}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditFromDashboard}
      />

      <EventFormModal
        open={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        event={editingEvent}
      />
    </div>
  )
}
