import { useState, useMemo } from 'react'
import {
  addMonths, subMonths, addWeeks, subWeeks, addDays, subDays,
  isSameMonth, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  startOfDay, endOfDay, parseISO,
} from 'date-fns'
import { Loader2, AlertCircle } from 'lucide-react'
import { CalendarHeader } from './CalendarHeader'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'
import { DayView } from './DayView'
import { EventDetailModal } from './EventDetailModal'
import { EventFormModal } from './EventFormModal'
import { useEvents } from '@/hooks/useEvents'
import { EVENT_TYPE_COLORS } from '@/utils/eventColors'
import type { CalendarView, CalendarEvent } from '@/types/calendar'
import type { Event, EventType } from '@/types'

export function CalendarShell() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [view, setView] = useState<CalendarView>('month')

  const [detailEvent, setDetailEvent] = useState<Event | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const { calStart, calEnd } = useMemo(() => {
    if (view === 'month') {
      const s = startOfMonth(currentDate)
      const e = endOfMonth(currentDate)
      return { calStart: startOfWeek(s, { weekStartsOn: 0 }), calEnd: endOfWeek(e, { weekStartsOn: 0 }) }
    }
    if (view === 'week') {
      return {
        calStart: startOfWeek(currentDate, { weekStartsOn: 0 }),
        calEnd: endOfWeek(currentDate, { weekStartsOn: 0 }),
      }
    }
    return { calStart: startOfDay(currentDate), calEnd: endOfDay(currentDate) }
  }, [view, currentDate])

  const { data: events = [], isLoading, error } = useEvents(calStart, calEnd)

  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        date: parseISO(e.start_time),
        startTime: parseISO(e.start_time),
        endTime: parseISO(e.end_time),
        color: e.color ?? EVENT_TYPE_COLORS[e.type as EventType],
        type: e.type as CalendarEvent['type'],
      })),
    [events],
  )

  function handlePrev() {
    if (view === 'month') setCurrentDate((d) => subMonths(d, 1))
    else if (view === 'week') setCurrentDate((d) => subWeeks(d, 1))
    else setCurrentDate((d) => subDays(d, 1))
  }

  function handleNext() {
    if (view === 'month') setCurrentDate((d) => addMonths(d, 1))
    else if (view === 'week') setCurrentDate((d) => addWeeks(d, 1))
    else setCurrentDate((d) => addDays(d, 1))
  }

  function handleSelectDay(date: Date) {
    setSelectedDate(date)
    if (!isSameMonth(date, currentDate) && view === 'month') {
      setCurrentDate(date)
    }
  }

  function handleEventClick(id: string) {
    const event = events.find((e) => e.id === id)
    if (event) setDetailEvent(event)
  }

  function openCreate() {
    setEditingEvent(null)
    setIsCreating(true)
  }

  function openEdit(event: Event) {
    setDetailEvent(null)
    setEditingEvent(event)
  }

  function closeForm() {
    setIsCreating(false)
    setEditingEvent(null)
  }

  const formOpen = isCreating || !!editingEvent

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={() => { setCurrentDate(new Date()); setSelectedDate(new Date()) }}
        onViewChange={setView}
        onNewEvent={openCreate}
      />

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-6 text-indigo-500 animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl m-4 p-4">
          <AlertCircle className="size-4 shrink-0" />
          <p className="text-sm">Erro ao carregar eventos.</p>
        </div>
      )}

      {!isLoading && !error && view === 'month' && (
        <MonthView
          currentDate={currentDate}
          selectedDate={selectedDate}
          events={calendarEvents}
          onSelectDay={handleSelectDay}
          onEventClick={handleEventClick}
        />
      )}

      {!isLoading && !error && view === 'week' && (
        <WeekView
          currentDate={currentDate}
          events={calendarEvents}
          onEventClick={handleEventClick}
          onDayClick={handleSelectDay}
        />
      )}

      {!isLoading && !error && view === 'day' && (
        <DayView
          currentDate={currentDate}
          events={calendarEvents}
          onEventClick={handleEventClick}
        />
      )}

      <EventDetailModal
        event={detailEvent}
        onClose={() => setDetailEvent(null)}
        onEdit={openEdit}
      />

      <EventFormModal
        open={formOpen}
        onClose={closeForm}
        event={editingEvent}
        defaultDate={isCreating ? selectedDate : null}
      />
    </div>
  )
}
