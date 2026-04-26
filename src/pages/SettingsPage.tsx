import { useAuth } from '@/hooks/useAuth'

export function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-lg space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <p className="text-sm font-semibold text-gray-700">Conta</p>
        <div className="h-px bg-gray-100" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Email</span>
          <span className="text-sm text-gray-800 font-medium">{user?.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">ID</span>
          <span className="text-xs text-gray-400 font-mono">{user?.id}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400">
        Mais configurações serão adicionadas nas próximas fases.
      </p>
    </div>
  )
}
