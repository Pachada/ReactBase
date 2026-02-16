import { createBrowserRouter } from 'react-router-dom'
import { AppShellLayout } from '@/app/AppShellLayout'
import { ProtectedRoute } from '@/app/routes/ProtectedRoute'
import { LoginPage } from '@/features/auth/LoginPage'
import { AdminPage } from '@/features/dashboard/AdminPage'
import { ComponentsPage } from '@/features/dashboard/ComponentsPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    handle: {
      title: 'Sign in',
    },
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
        handle: {
          breadcrumb: 'Dashboard',
          title: 'Dashboard',
        },
      },
      {
        path: 'components',
        element: <ComponentsPage />,
        handle: {
          breadcrumb: 'Components',
          title: 'Components',
        },
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminPage />
          </ProtectedRoute>
        ),
        handle: {
          breadcrumb: 'Admin',
          title: 'Admin',
        },
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
    handle: {
      title: 'Not found',
    },
  },
])
