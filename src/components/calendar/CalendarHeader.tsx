import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
}

const navBtnCls =
  'p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors'

export function CalendarHeader({
  currentDate,
  view,
  onPrev,
  onNext,
  onToday,
  onViewChange,
}: CalendarHeaderProps) {
  const raw = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })
  const title = raw.charAt(0).toUpperCase() + raw.slice(1)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-wrap gap-3">
      <div className="flex items-center gap-1">
        <button onClick={onPrev} className={navBtnCls} aria-label="Mês anterior">
          <ChevronLeft className="size-4" />
        </button>
        <button onClick={onNext} className={navBtnCls} aria-label="Próximo mês">
          <ChevronRight className="size-4" />
        </button>

        <h2 className="text-sm sm:text-base font-semibold text-gray-900 mx-2 min-w-[140px]">
          {title}
        </h2>

        <button
          onClick={onToday}
          className={cn(
            navBtnCls,
            'px-3 text-xs font-medium border border-gray-200 rounded-lg',
          )}
        >
          Hoje
        </button>
      </div>

      <CalendarViewToggle view={view} onChange={onViewChange} />
    </div>
  )
}
