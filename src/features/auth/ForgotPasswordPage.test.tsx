import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/core/api/ApiError'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { renderWithProviders } from '@/test/test-utils'

vi.mock('@/core/api/http-client', () => ({
  apiClient: {
    request: (...args: unknown[]) => apiRequestMock(...args),
    setRefreshHandler: vi.fn(),
    setLogoutHandler: vi.fn(),
  },
}))

vi.mock('@/core/auth/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    token: null,
    refreshToken: null,
    status: 'anonymous' as const,
    loginWithEnvelope: (...args: unknown[]) => loginWithEnvelopeMock(...args),
    login: vi.fn(),
    logout: vi.fn(),
    hasRole: vi.fn(() => false),
    refreshUser: vi.fn(),
    sessionExpiresAt: null,
    resetSessionTimer: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

const apiRequestMock = vi.fn()
const loginWithEnvelopeMock = vi.fn()

const mockEnvelope = {
  access_token: 'temp-token',
  refresh_token: 'temp-refresh',
  session: { id: 1, user_id: 1, created: '', updated: '', enable: true },
  user: {
    id: 1,
    username: 'user',
    email: 'user@example.com',
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
  },
}

function renderPage() {
  return renderWithProviders(<ForgotPasswordPage />, { route: '/forgot-password' })
}

async function submitEmail(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/email address/i), 'user@example.com')
  await user.click(screen.getByRole('button', { name: /send code/i }))
  await screen.findByText(/6-digit code sent to/i)
}

async function fillOtpAndPasswords(user: ReturnType<typeof userEvent.setup>) {
  // Mantine PinInput renders type="text" inputs (role="textbox") regardless of the type prop
  const pinInputs = screen.getAllByRole('textbox')
  for (let i = 0; i < pinInputs.length && i < 6; i++) {
    await user.type(pinInputs[i], String(i + 1))
  }
  await user.type(screen.getByLabelText(/^new password$/i), 'NewPass123')
  await user.type(screen.getByLabelText(/^confirm new password$/i), 'NewPass123')
}

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    apiRequestMock.mockReset()
    loginWithEnvelopeMock.mockReset()
    navigateMock.mockReset()
  })

  it('shows the email form on initial render', () => {
    renderPage()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send code/i })).toBeInTheDocument()
  })

  it('advances to the OTP + password step after submitting a valid email', async () => {
    apiRequestMock.mockResolvedValue(undefined)
    renderPage()
    const user = userEvent.setup()

    await submitEmail(user)

    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument()
  })

  it('navigates to / after a successful reset and auto-login', async () => {
    apiRequestMock
      .mockResolvedValueOnce(undefined) // POST /request (email step)
      .mockResolvedValueOnce(mockEnvelope) // POST /validate-code
      .mockResolvedValueOnce(undefined) // POST /change-password
    loginWithEnvelopeMock.mockResolvedValue(undefined)

    renderPage()
    const user = userEvent.setup()

    await submitEmail(user)
    await fillOtpAndPasswords(user)
    await user.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/'))
    expect(loginWithEnvelopeMock).toHaveBeenCalledWith(mockEnvelope)
  })

  it('shows the success screen when auto-login fails after a successful reset', async () => {
    apiRequestMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(mockEnvelope)
      .mockResolvedValueOnce(undefined)
    loginWithEnvelopeMock.mockRejectedValue(new Error('login failed'))

    renderPage()
    const user = userEvent.setup()

    await submitEmail(user)
    await fillOtpAndPasswords(user)
    await user.click(screen.getByRole('button', { name: /reset password/i }))

    await screen.findByText(/password changed/i)
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('shows an invalid code error for 400/401 responses', async () => {
    apiRequestMock
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new ApiError('bad request', 400))

    renderPage()
    const user = userEvent.setup()

    await submitEmail(user)
    await fillOtpAndPasswords(user)
    await user.click(screen.getByRole('button', { name: /reset password/i }))

    await screen.findByText(/invalid code/i)
  })

  it('shows an expired code error for 410 responses', async () => {
    apiRequestMock
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new ApiError('gone', 410))

    renderPage()
    const user = userEvent.setup()

    await submitEmail(user)
    await fillOtpAndPasswords(user)
    await user.click(screen.getByRole('button', { name: /reset password/i }))

    await screen.findByText(/expired/i)
  })
})
