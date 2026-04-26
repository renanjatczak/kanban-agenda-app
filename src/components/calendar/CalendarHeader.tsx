import { format, startOfWeek, endOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CalendarView } from '@/types/calendar'
import { CalendarViewToggle } from './CalendarViewToggle'

interface CalendarHeaderProps {
  currentDate: Date
  view: CalendarView
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onViewChange: (view: CalendarView) => void
  onNewEvent: () => void
}

const navBtnCls =
  'p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-white transition-colors'

function getTitle(date: Date, view: CalendarView): string {
  if (view === 'month') {
    const raw = format(date, "MMMM 'de' yyyy", { locale: ptBR })
    return raw.charAt(0).toUpperCase() + raw.slice(1)
  }
  if (view === 'week') {
    const ws = startOfWeek(date, { weekStartsOn: 0 })
    const we = endOfWeek(date, { weekStartsOn: 0 })
    const start = format(ws, 'd')
    const end = format(we, "d 'de' MMM, yyyy", { locale: ptBR })
    return `${start} – ${end}`
  }
  const raw = format(date, "EEEE, d 'de' MMM 'de' yyyy", { locale: ptBR })
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

export function CalendarHeader({
  currentDate,
  view,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onNewEvent,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex-wrap gap-3">
      <div className="flex items-center gap-1">
        <button onClick={onPrev} className={navBtnCls} aria-label="Anterior">
          <ChevronLeft className="size-4" />
        </button>
        <button onClick={onNext} className={navBtnCls} aria-label="Próximo">
          <ChevronRight className="size-4" />
        </button>
        <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mx-2 min-w-[140px]">
          {getTitle(currentDate, view)}
        </h2>
        <button
          onClick={onToday}
          className={cn(navBtnCls, 'px-3 text-xs font-medium border border-gray-200 dark:border-slate-600 rounded-lg')}
        >
          Hoje
        </button>
      </div>

      <div className="flex items-center gap-2">
        <CalendarViewToggle view={view} onChange={onViewChange} />
        <button
          onClick={onNewEvent}
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg px-3 py-1.5 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">Novo evento</span>
        </button>
      </div>
    </div>
  )
}
