import { createContext } from 'react'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
