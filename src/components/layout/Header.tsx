import { Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  title: string
  onMenuClick: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  return (
    <header className="h-16 shrink-0 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors p-1 rounded"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-gray-400 truncate max-w-[200px]">
          {user?.email}
        </span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
          title="Sair da conta"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  )
}
