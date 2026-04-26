const COLUMNS = ['A fazer', 'Em andamento', 'Concluído']

export function KanbanPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        O board Kanban será implementado na Fase 3.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div key={col} className="bg-white rounded-xl border border-gray-200 p-4 min-h-64">
            <p className="text-sm font-semibold text-gray-700 mb-3">{col}</p>
            <div className="h-px bg-gray-100 mb-3" />
            <p className="text-xs text-gray-400 text-center mt-8">Sem cards</p>
          </div>
        ))}
      </div>
    </div>
  )
}
