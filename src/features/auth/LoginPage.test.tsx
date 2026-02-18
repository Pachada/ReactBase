import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LoginPage } from '@/features/auth/LoginPage'
import { renderWithProviders } from '@/test/test-utils'

describe('LoginPage', () => {
  it('renders login form and validates required fields', async () => {
    renderWithProviders(<LoginPage />, { route: '/login' })
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Username is required')).toBeInTheDocument()
    expect(await screen.findByText('Password is required')).toBeInTheDocument()
  })
})
