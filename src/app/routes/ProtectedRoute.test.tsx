import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from '@/app/routes/ProtectedRoute'
import { AuthProvider } from '@/core/auth/AuthContext'
import type { AuthState } from '@/core/auth/types'

vi.mock('@/core/auth/auth-storage', () => ({
  loadAuthState: () => loadAuthStateMock(),
  saveAuthState: vi.fn(),
  getRememberMePreference: vi.fn(() => false),
}))

const loadAuthStateMock = vi.fn<() => AuthState>()

const anonymousState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  status: 'anonymous',
}

const adminUser = {
  id: 1,
  username: 'admin',
  name: 'Admin User',
  email: 'admin@example.com',
  role_id: 1,
  roleName: 'admin',
  first_name: 'Admin',
  last_name: 'User',
  birthday: null,
  phone: null,
}

const adminState: AuthState = {
  user: adminUser,
  token: 'test-token',
  refreshToken: 'test-refresh',
  status: 'authenticated',
}

const viewerState: AuthState = {
  ...adminState,
  user: { ...adminUser, roleName: 'viewer' },
}

function renderRoutes(initialEntry: string, roles?: string[]) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<span>Login Page</span>} />
          <Route path="/" element={<span>Home</span>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute roles={roles}>
                <span>Protected Content</span>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    loadAuthStateMock.mockReturnValue(anonymousState)
  })

  it('redirects anonymous users to /login', () => {
    renderRoutes('/protected')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders children for authenticated users with no role restriction', () => {
    loadAuthStateMock.mockReturnValue(adminState)
    renderRoutes('/protected')
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects authenticated users who lack the required role to /', () => {
    loadAuthStateMock.mockReturnValue(viewerState)
    renderRoutes('/protected', ['admin'])
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('renders children for authenticated users with the required role', () => {
    loadAuthStateMock.mockReturnValue(adminState)
    renderRoutes('/protected', ['admin'])
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
