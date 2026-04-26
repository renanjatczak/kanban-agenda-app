import type { CalendarEvent } from '@/types/calendar'

interface CalendarEventBadgeProps {
  event: CalendarEvent
}

export function CalendarEventBadge({ event }: CalendarEventBadgeProps) {
  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium truncate hover:opacity-90 transition-opacity cursor-pointer"
      style={{ backgroundColor: `${event.color}22`, color: event.color }}
      title={event.title}
    >
      <span
        className="size-1.5 rounded-full shrink-0"
        style={{ backgroundColor: event.color }}
      />
      <span className="truncate">{event.title}</span>
    </div>
  )
}
