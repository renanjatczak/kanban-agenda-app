import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { RequireGuest } from '@/components/auth/RequireGuest'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { KanbanPage } from '@/pages/KanbanPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { SettingsPage } from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/app" replace /> },
  {
    element: <RequireGuest />,
    children: [
      {
        path: '/login',
        element: (
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        ),
      },
      {
        path: '/register',
        element: (
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        ),
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'kanban', element: <KanbanPage /> },
          { path: 'calendar', element: <CalendarPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/app" replace /> },
])
