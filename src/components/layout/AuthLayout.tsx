import type { ReactNode } from 'react'
import { LayoutDashboard } from 'lucide-react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="bg-indigo-600 rounded-lg p-1.5">
            <LayoutDashboard className="size-5 text-white" />
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">
            Kanban & Agenda
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
