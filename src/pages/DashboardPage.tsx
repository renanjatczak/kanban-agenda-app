import { Link } from 'react-router-dom'
import { Columns3 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'

export function DashboardPage() {
  const { user } = useAuth()
  const { data: tasks = [], isLoading } = useTasks()

  const todo = tasks.filter((t) => t.status === 'todo').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const done = tasks.filter((t) => t.status === 'done').length

  const stats = [
    { label: 'A Fazer', value: todo, color: 'text-slate-700' },
    { label: 'Em Progresso', value: inProgress, color: 'text-blue-700' },
    { label: 'Concluídas', value: done, color: 'text-emerald-700' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Olá, {user?.email?.split('@')[0]} 👋
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Aqui está um resumo das suas tarefas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>
              {isLoading ? '—' : value}
            </p>
          </div>
        ))}
      </div>

      {!isLoading && tasks.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center space-y-3">
          <div className="size-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <Columns3 className="size-6 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">Nenhuma tarefa ainda</p>
          <p className="text-xs text-gray-400">Crie sua primeira tarefa no board Kanban.</p>
          <Link
            to="/app/kanban"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Ir para o Kanban
          </Link>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Próximos eventos</p>
        <p className="text-sm text-gray-400">Nenhum evento próximo. (disponível na Fase 5)</p>
      </div>
    </div>
  )
}
