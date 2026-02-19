import { Suspense, lazy, type ReactElement } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { AppShellLayout } from '@/app/AppShellLayout'
import { ProtectedRoute } from '@/app/routes/ProtectedRoute'
import { ErrorPage } from '@/pages/ErrorPage'

const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const SignUpPage = lazy(() =>
  import('@/features/auth/SignUpPage').then((module) => ({ default: module.SignUpPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/ForgotPasswordPage').then((module) => ({
    default: module.ForgotPasswordPage,
  })),
)
const AdminPage = lazy(() =>
  import('@/features/dashboard/AdminPage').then((module) => ({
    default: module.AdminPage,
  })),
)
const ComponentsPage = lazy(() =>
  import('@/features/dashboard/ComponentsPage').then((module) => ({
    default: module.ComponentsPage,
  })),
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
)
const SettingsPage = lazy(() =>
  import('@/features/settings/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

const withSuspense = (element: ReactElement) => (
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <Suspense fallback={null}>{element}</Suspense>
  </ErrorBoundary>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(<LoginPage />),
    handle: {
      title: 'Sign in',
    },
  },
  {
    path: '/signup',
    element: withSuspense(<SignUpPage />),
    handle: {
      title: 'Sign up',
    },
  },
  {
    path: '/forgot-password',
    element: withSuspense(<ForgotPasswordPage />),
    handle: {
      title: 'Forgot password',
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
        element: withSuspense(<DashboardPage />),
        handle: {
          breadcrumb: 'Dashboard',
          title: 'Dashboard',
          quickSearchPlaceholder: 'Search dashboard insights',
          actions: [
            { label: 'New report', variant: 'light' },
            { label: 'Export', variant: 'default' },
          ],
        },
      },
      {
        path: 'components',
        element: withSuspense(<ComponentsPage />),
        handle: {
          breadcrumb: 'Components',
          title: 'Components',
          quickSearchPlaceholder: 'Search components',
          actions: [
            { label: 'Add component', variant: 'light' },
            { label: 'Open docs', variant: 'default' },
          ],
        },
      },
      {
        path: 'settings',
        element: withSuspense(<SettingsPage />),
        handle: {
          breadcrumb: 'Settings',
          title: 'Settings',
        },
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute roles={['admin']}>{withSuspense(<AdminPage />)}</ProtectedRoute>
        ),
        handle: {
          breadcrumb: 'Admin',
          title: 'Admin',
          quickSearchPlaceholder: 'Search admin settings',
          actions: [
            { label: 'Invite user', variant: 'light' },
            { label: 'Audit logs', variant: 'default' },
          ],
        },
      },
    ],
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
    handle: {
      title: 'Not found',
    },
  },
])
