import { CalendarDays } from 'lucide-react'

export function CalendarPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-3">
      <div className="size-14 bg-indigo-100 rounded-full flex items-center justify-center">
        <CalendarDays className="size-7 text-indigo-600" />
      </div>
      <h2 className="text-base font-semibold text-gray-800">Agenda</h2>
      <p className="text-sm text-gray-400 max-w-xs">
        A visualização de agenda mensal e semanal será implementada na Fase 4.
      </p>
    </div>
  )
}
