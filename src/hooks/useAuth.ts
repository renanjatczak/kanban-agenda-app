import { useAuthContext } from '@/hooks/useAuthContext'
import { signIn, signUp, signOut } from '@/services/auth.service'

export function useAuth() {
  const { user, session, loading } = useAuthContext()
  return { user, session, loading, signIn, signUp, signOut }
}
