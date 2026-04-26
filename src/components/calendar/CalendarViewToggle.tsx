import { cn } from '@/lib/utils'
import type { CalendarView } from '@/types/calendar'

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: 'month', label: 'Mês' },
  { value: 'week', label: 'Semana' },
  { value: 'day', label: 'Dia' },
]

interface CalendarViewToggleProps {
  view: CalendarView
  onChange: (view: CalendarView) => void
}

export function CalendarViewToggle({ view, onChange }: CalendarViewToggleProps) {
  return (
    <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
      {VIEWS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium transition-colors',
            view === value
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
