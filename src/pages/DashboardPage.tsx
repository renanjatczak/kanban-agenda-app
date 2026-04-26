import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Olá, {user?.email?.split('@')[0]} 👋
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Aqui você verá um resumo das suas tarefas e eventos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['Tarefas pendentes', 'Em andamento', 'Concluídas'].map((label) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Próximos eventos</p>
        <p className="text-sm text-gray-400">Nenhum evento próximo. (em breve)</p>
      </div>
    </div>
  )
}
