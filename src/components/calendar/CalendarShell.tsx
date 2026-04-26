import { useState } from 'react'
import { addMonths, subMonths, addDays, subDays, isSameMonth } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { CalendarHeader } from './CalendarHeader'
import { MonthView } from './MonthView'
import type { CalendarView, CalendarEvent } from '@/types/calendar'

// Demo data — will be replaced by Supabase events in Phase 5
const today = new Date()
const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Reunião de equipe',   date: today,               color: '#6366f1', type: 'meeting'  },
  { id: '2', title: 'Standup diário',      date: addDays(today, 1),   color: '#6366f1', type: 'meeting'  },
  { id: '3', title: 'Revisão de PR',       date: addDays(today, 2),   color: '#8b5cf6', type: 'focus'    },
  { id: '4', title: 'Code Review',         date: addDays(today, 2),   color: '#8b5cf6', type: 'focus'    },
  { id: '5', title: 'Almoço com cliente',  date: addDays(today, 4),   color: '#f59e0b', type: 'personal' },
  { id: '6', title: 'Planning do sprint',  date: addDays(today, 7),   color: '#6366f1', type: 'meeting'  },
  { id: '7', title: 'Deadline v2.0',       date: addDays(today, 10),  color: '#ef4444', type: 'reminder' },
  { id: '8', title: 'Lembrete: relatório', date: addDays(today, 12),  color: '#ef4444', type: 'reminder' },
  { id: '9', title: 'Sessão de foco',      date: addDays(today, 14),  color: '#8b5cf6', type: 'focus'    },
  { id: 'a', title: 'Deploy produção',     date: subDays(today, 2),   color: '#10b981', type: 'focus'    },
  { id: 'b', title: 'Retrospectiva',       date: subDays(today, 1),   color: '#6366f1', type: 'meeting'  },
]

export function CalendarShell() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [view, setView] = useState<CalendarView>('month')

  function handleSelectDay(date: Date) {
    setSelectedDate(date)
    if (!isSameMonth(date, currentDate)) {
      setCurrentDate(date)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrev={() => setCurrentDate((d) => subMonths(d, 1))}
        onNext={() => setCurrentDate((d) => addMonths(d, 1))}
        onToday={() => { setCurrentDate(new Date()); setSelectedDate(new Date()) }}
        onViewChange={setView}
      />

      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          selectedDate={selectedDate}
          events={MOCK_EVENTS}
          onSelectDay={handleSelectDay}
        />
      )}

      {view !== 'month' && (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <div className="size-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <CalendarDays className="size-6 text-indigo-500" />
          </div>
          <p className="text-sm font-medium text-gray-700">
            Visualização {view === 'week' ? 'semanal' : 'diária'}
          </p>
          <p className="text-xs text-gray-400">Disponível na Fase 5.</p>
        </div>
      )}
    </div>
  )
}
