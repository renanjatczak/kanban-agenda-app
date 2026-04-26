import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { Moon, Sun } from 'lucide-react'

export function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="max-w-lg space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 space-y-3">
        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Conta</p>
        <div className="h-px bg-gray-100 dark:bg-slate-700" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-slate-400">Email</span>
          <span className="text-sm text-gray-800 dark:text-white font-medium">{user?.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-slate-400">ID</span>
          <span className="text-xs text-gray-400 dark:text-slate-500 font-mono">{user?.id}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">Aparência</p>
        <div className="h-px bg-gray-100 dark:bg-slate-700 mb-3" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-slate-200">Tema</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
              {theme === 'dark' ? 'Modo escuro ativo' : 'Modo claro ativo'}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-slate-500">
        Mais configurações serão adicionadas nas próximas fases.
      </p>
    </div>
  )
}
