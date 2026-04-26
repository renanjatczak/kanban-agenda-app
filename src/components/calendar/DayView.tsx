import { isToday, isSameDay, format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EVENT_TYPE_LABELS } from '@/utils/eventColors'
import type { CalendarEvent } from '@/types/calendar'

interface DayViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (id: string) => void
}

export function DayView({ currentDate, events, onEventClick }: DayViewProps) {
  const today = isToday(currentDate)
  const dayEvents = events
    .filter((e) => isSameDay(e.date, currentDate))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

  const rawTitle = format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
  const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1)

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <p className={cn('text-base font-semibold', today ? 'text-indigo-600' : 'text-gray-800 dark:text-white')}>
          {title}
        </p>
        {today && <p className="text-xs text-indigo-500 mt-0.5">Hoje</p>}
      </div>

      {dayEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
          <Clock className="size-8 text-gray-300 dark:text-slate-600" />
          <p className="text-sm text-gray-400 dark:text-slate-500">Nenhum evento neste dia</p>
        </div>
      ) : (
        <div className="space-y-2">
          {dayEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => onEventClick(event.id)}
              className="w-full flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow text-left"
            >
              <span
                className="size-3 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: event.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    {format(event.startTime, 'HH:mm')} – {format(event.endTime, 'HH:mm')}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-slate-500">·</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    {EVENT_TYPE_LABELS[event.type]}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
