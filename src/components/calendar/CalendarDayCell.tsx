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
}

export function CalendarDayCell({
  date,
  isCurrentMonth,
  isSelected,
  isWeekend,
  events,
  onSelect,
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
        'min-h-[88px] sm:min-h-[108px] p-1 sm:p-1.5 border-b border-r border-gray-100',
        'cursor-pointer outline-none transition-colors',
        !isCurrentMonth && 'bg-gray-50/60',
        isCurrentMonth && isWeekend && 'bg-slate-50/40',
        isSelected && !today && 'bg-indigo-50/60',
        'hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-300',
      )}
    >
      {/* Day number */}
      <div className="flex justify-end mb-1">
        <span
          className={cn(
            'flex items-center justify-center rounded-full font-medium',
            'text-xs sm:text-sm size-6 sm:size-7 transition-colors',
            today && 'bg-indigo-600 text-white font-bold',
            !today && isSelected && 'bg-indigo-100 text-indigo-700',
            !today && !isSelected && isCurrentMonth && !isWeekend && 'text-gray-700',
            !today && !isSelected && isCurrentMonth && isWeekend && 'text-rose-400',
            !today && !isSelected && !isCurrentMonth && 'text-gray-400',
          )}
        >
          {format(date, 'd')}
        </span>
      </div>

      {/* Events — full badges on sm+ */}
      <div className="space-y-0.5 hidden sm:block">
        {visible.map((event) => (
          <CalendarEventBadge key={event.id} event={event} />
        ))}
        {hidden > 0 && (
          <p className="text-xs text-gray-400 pl-1 leading-tight">+{hidden} mais</p>
        )}
      </div>

      {/* Events — dots on mobile */}
      {events.length > 0 && (
        <div className="flex gap-0.5 flex-wrap justify-center mt-0.5 sm:hidden">
          {events.slice(0, 4).map((event) => (
            <span
              key={event.id}
              className="size-1.5 rounded-full"
              style={{ backgroundColor: event.color }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
