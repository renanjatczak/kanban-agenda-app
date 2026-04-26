import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'
import { PageLoader } from '@/components/ui/PageLoader'

export function RequireGuest() {
  const { user, loading } = useAuthContext()

  if (loading) return <PageLoader />
  if (user) return <Navigate to="/app" replace />

  return <Outlet />
}
