import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'
import { PageLoader } from '@/components/ui/PageLoader'

export function RequireAuth() {
  const { user, loading } = useAuthContext()
  const location = useLocation()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}
