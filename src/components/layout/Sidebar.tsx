import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Columns3, CalendarDays, Settings, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/kanban', icon: Columns3, label: 'Kanban', end: false },
  { to: '/app/calendar', icon: CalendarDays, label: 'Agenda', end: false },
  { to: '/app/settings', icon: Settings, label: 'Configurações', end: false },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full w-64 bg-slate-900 flex flex-col',
          'transition-transform duration-300 ease-in-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded-lg p-1.5">
              <LayoutDashboard className="size-4 text-white" />
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">
              Kanban & Agenda
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white transition-colors p-1 rounded"
            aria-label="Fechar menu"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
