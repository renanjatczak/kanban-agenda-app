export type CalendarView = 'month' | 'week' | 'day'

export type CalendarEventType = 'meeting' | 'focus' | 'reminder' | 'personal'

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  startTime: Date
  endTime: Date
  color: string
  type: CalendarEventType
}
