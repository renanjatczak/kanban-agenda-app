import { startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, format, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/types/calendar'
import { CalendarEventBadge } from './CalendarEventBadge'

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (id: string) => void
  onDayClick: (date: Date) => void
}

export function WeekView({ currentDate, events, onEventClick, onDayClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-slate-700">
        {days.map((day) => {
          const dayOfWeek = getDay(day)
          const weekend = dayOfWeek === 0 || dayOfWeek === 6
          const today = isToday(day)
          return (
            <div
              key={day.toISOString()}
              className="py-3 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              onClick={() => onDayClick(day)}
            >
              <p className={cn(
                'text-xs font-semibold uppercase tracking-wide mb-1',
                weekend ? 'text-rose-400' : 'text-gray-400 dark:text-slate-500',
              )}>
                {format(day, 'EEE', { locale: ptBR })}
              </p>
              <span className={cn(
                'inline-flex items-center justify-center size-8 rounded-full text-sm font-semibold',
                today && 'bg-indigo-600 text-white',
                !today && 'text-gray-700 dark:text-slate-200',
              )}>
                {format(day, 'd')}
              </span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-7 min-h-[400px]">
        {days.map((day) => {
          const dayEvents = events.filter((e) => isSameDay(e.date, day))
          return (
            <div
              key={day.toISOString()}
              className="border-r border-gray-100 dark:border-slate-700 last:border-r-0 p-1.5 space-y-0.5"
            >
              {dayEvents.length === 0 ? (
                <p className="text-xs text-gray-300 dark:text-slate-600 text-center mt-4">—</p>
              ) : (
                dayEvents.map((event) => (
                  <CalendarEventBadge
                    key={event.id}
                    event={event}
                    onClick={() => onEventClick(event.id)}
                  />
                ))
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
