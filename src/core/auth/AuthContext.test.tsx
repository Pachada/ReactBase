import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from '@/core/auth/AuthContext'

vi.mock('@/core/api/session-api', () => ({
  sessionApi: {
    login: (...args: unknown[]) => loginMock(...args),
    logout: (...args: unknown[]) => logoutMock(...args),
    refresh: (...args: unknown[]) => refreshMock(...args),
    getSession: (...args: unknown[]) => getSessionMock(...args),
  },
}))

vi.mock('@/features/admin/roles-api', () => ({
  rolesApi: {
    listRoles: (...args: unknown[]) => listRolesMock(...args),
  },
}))

vi.mock('@/core/auth/auth-storage', () => ({
  loadAuthState: () => ({
    user: null,
    token: null,
    refreshToken: null,
    status: 'anonymous',
  }),
  saveAuthState: vi.fn(),
  getRememberMePreference: vi.fn(() => false),
}))

const loginMock = vi.fn()
const logoutMock = vi.fn()
const refreshMock = vi.fn()
const getSessionMock = vi.fn()
const listRolesMock = vi.fn()

const baseSession = { id: 1, user_id: 1, created: '', updated: '', enable: true }

const baseApiUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  phone: null,
  role_id: 1,
  created: '',
  updated: '',
  enable: true,
  first_name: 'Test',
  last_name: 'User',
  birthday: null,
  verified: true,
  email_confirmed: true,
  phone_confirmed: false,
}

function AuthTestConsumer() {
  const auth = useAuth()
  return (
    <>
      <span data-testid="status">{auth.status}</span>
      <span data-testid="username">{auth.user?.username ?? ''}</span>
      <span data-testid="role">{auth.user?.roleName ?? ''}</span>
      <span data-testid="token">{auth.token ?? ''}</span>
      <button
        onClick={() => auth.login({ username: 'u', password: 'p' }).catch(() => {})}
      >
        login
      </button>
      <button onClick={auth.logout}>logout</button>
      <button onClick={auth.resetSessionTimer}>refresh</button>
    </>
  )
}

function renderAuth() {
  return render(
    <AuthProvider>
      <AuthTestConsumer />
    </AuthProvider>,
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    loginMock.mockReset()
    logoutMock.mockReset()
    refreshMock.mockReset()
    listRolesMock.mockReset()
    logoutMock.mockResolvedValue(undefined)
  })

  it('initialises in anonymous state', () => {
    renderAuth()
    expect(screen.getByTestId('status')).toHaveTextContent('anonymous')
  })

  it('sets authenticated state and resolves role on successful login', async () => {
    loginMock.mockResolvedValue({
      access_token: 'access-123',
      refresh_token: 'refresh-456',
      session: baseSession,
      user: { ...baseApiUser, role_id: 2 },
    })
    listRolesMock.mockResolvedValue([{ id: 2, name: 'admin', enable: true }])

    renderAuth()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'login' }))

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('authenticated'),
    )
    expect(screen.getByTestId('username')).toHaveTextContent('testuser')
    expect(screen.getByTestId('role')).toHaveTextContent('admin')
    expect(screen.getByTestId('token')).toHaveTextContent('access-123')
  })

  it('falls back to the NoSQL role string when rolesApi rejects', async () => {
    loginMock.mockResolvedValue({
      access_token: 'token',
      refresh_token: 'refresh',
      session: baseSession,
      user: { ...baseApiUser, role: 'editor' },
    })
    listRolesMock.mockRejectedValue(new Error('roles API down'))

    renderAuth()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'login' }))

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('authenticated'),
    )
    expect(screen.getByTestId('role')).toHaveTextContent('editor')
  })

  it('remains anonymous when the login API rejects', async () => {
    loginMock.mockRejectedValue(new Error('Network error'))

    renderAuth()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'login' }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalled()
      expect(screen.getByTestId('status')).toHaveTextContent('anonymous')
    })
  })

  it('clears auth state on logout', async () => {
    loginMock.mockResolvedValue({
      access_token: 'tok',
      refresh_token: 'ref',
      session: baseSession,
      user: baseApiUser,
    })
    listRolesMock.mockResolvedValue([{ id: 1, name: 'viewer', enable: true }])

    renderAuth()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'login' }))
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('authenticated'),
    )

    await user.click(screen.getByRole('button', { name: 'logout' }))
    expect(screen.getByTestId('status')).toHaveTextContent('anonymous')
  })

  it('updates the access token after a successful silent refresh', async () => {
    loginMock.mockResolvedValue({
      access_token: 'old-token',
      refresh_token: 'old-refresh',
      session: baseSession,
      user: baseApiUser,
    })
    listRolesMock.mockResolvedValue([{ id: 1, name: 'viewer', enable: true }])
    refreshMock.mockResolvedValue({
      access_token: 'new-token',
      refresh_token: 'new-refresh',
    })

    renderAuth()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'login' }))
    await waitFor(() =>
      expect(screen.getByTestId('token')).toHaveTextContent('old-token'),
    )

    await user.click(screen.getByRole('button', { name: 'refresh' }))
    await waitFor(() =>
      expect(screen.getByTestId('token')).toHaveTextContent('new-token'),
    )
  })
})
