import { isToday, format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/types/calendar'
import { CalendarEventBadge } from './CalendarEventBadge'

const MAX_VISIBLE = 3

interface CalendarDayCellProps {
  date: Date
  isCurrentMonth: boolean
  isSelected: boolean
  isWeekend: boolean
  events: CalendarEvent[]
  onSelect: () => void
  onEventClick: (id: string) => void
}

export function CalendarDayCell({
  date,
  isCurrentMonth,
  isSelected,
  isWeekend,
  events,
  onSelect,
  onEventClick,
}: CalendarDayCellProps) {
  const today = isToday(date)
  const hidden = Math.max(0, events.length - MAX_VISIBLE)
  const visible = events.slice(0, MAX_VISIBLE)

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      className={cn(
        'min-h-[88px] sm:min-h-[108px] p-1 sm:p-1.5 border-b border-r border-gray-100 dark:border-slate-700',
        'cursor-pointer outline-none transition-colors',
        !isCurrentMonth && 'bg-gray-50/60 dark:bg-slate-900/60',
        isCurrentMonth && isWeekend && 'bg-slate-50/40 dark:bg-slate-800/40',
        isCurrentMonth && !isWeekend && 'dark:bg-slate-800/20',
        isSelected && !today && 'bg-indigo-50/60 dark:bg-indigo-950/30',
        'hover:bg-gray-50 dark:hover:bg-slate-700/40',
        'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-300',
      )}
    >
      <div className="flex justify-end mb-1">
        <span
          className={cn(
            'flex items-center justify-center rounded-full font-medium',
            'text-xs sm:text-sm size-6 sm:size-7 transition-colors',
            today && 'bg-indigo-600 text-white font-bold',
            !today && isSelected && 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
            !today && !isSelected && isCurrentMonth && !isWeekend && 'text-gray-700 dark:text-slate-200',
            !today && !isSelected && isCurrentMonth && isWeekend && 'text-rose-400',
            !today && !isSelected && !isCurrentMonth && 'text-gray-400 dark:text-slate-600',
          )}
        >
          {format(date, 'd')}
        </span>
      </div>

      <div className="space-y-0.5 hidden sm:block">
        {visible.map((event) => (
          <CalendarEventBadge key={event.id} event={event} onClick={() => onEventClick(event.id)} />
        ))}
        {hidden > 0 && (
          <p className="text-xs text-gray-400 dark:text-slate-500 pl-1 leading-tight">+{hidden} mais</p>
        )}
      </div>

      {events.length > 0 && (
        <div className="flex gap-0.5 flex-wrap justify-center mt-0.5 sm:hidden">
          {events.slice(0, 4).map((event) => (
            <span key={event.id} className="size-1.5 rounded-full" style={{ backgroundColor: event.color }} />
          ))}
        </div>
      )}
    </div>
  )
}
