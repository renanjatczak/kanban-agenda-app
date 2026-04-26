import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  getDay,
} from 'date-fns'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/types/calendar'
import { CalendarDayCell } from './CalendarDayCell'

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

interface MonthViewProps {
  currentDate: Date
  selectedDate: Date | null
  events: CalendarEvent[]
  onSelectDay: (date: Date) => void
}

export function MonthView({ currentDate, selectedDate, events, onSelectDay }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {WEEK_DAYS.map((label, i) => (
          <div
            key={label}
            className={cn(
              'py-2 text-center text-xs font-semibold uppercase tracking-wide select-none',
              i === 0 || i === 6 ? 'text-rose-400' : 'text-gray-400',
            )}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label[0]}</span>
          </div>
        ))}
      </div>

      {/* Day cells grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayOfWeek = getDay(day)
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          return (
            <CalendarDayCell
              key={day.toISOString()}
              date={day}
              isCurrentMonth={isSameMonth(day, currentDate)}
              isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
              isWeekend={isWeekend}
              events={events.filter((e) => isSameDay(e.date, day))}
              onSelect={() => onSelectDay(day)}
            />
          )
        })}
      </div>
    </div>
  )
}
