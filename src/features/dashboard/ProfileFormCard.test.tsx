import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProfileFormCard } from '@/features/dashboard/ProfileFormCard'
import { renderWithProviders } from '@/test/test-utils'

const fetchProfileMock = vi.fn()
const updateProfileMock = vi.fn()

vi.mock('@/features/dashboard/profile-api', () => ({
  fetchProfile: () => fetchProfileMock(),
  updateProfile: (nextProfile: unknown) => updateProfileMock(nextProfile),
}))

describe('ProfileFormCard', () => {
  beforeEach(() => {
    fetchProfileMock.mockReset()
    updateProfileMock.mockReset()
  })

  it('rolls back optimistic updates when profile save fails', async () => {
    fetchProfileMock.mockResolvedValue({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      role: 'viewer',
    })
    updateProfileMock.mockImplementation(
      () =>
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Sync rejected by server.')), 50)
        }),
    )

    renderWithProviders(<ProfileFormCard />, { route: '/' })
    const user = userEvent.setup()

    const fullNameInput = await screen.findByLabelText(/full name/i)
    expect(fullNameInput).toHaveValue('Jane Doe')

    await user.clear(fullNameInput)
    await user.type(fullNameInput, 'Alex Doe')

    await user.click(screen.getByRole('button', { name: /save profile/i }))

    expect(updateProfileMock).toHaveBeenCalledWith({
      fullName: 'Alex Doe',
      email: 'jane@example.com',
      role: 'viewer',
    })

    await screen.findByText(/rolled back to the last saved profile/i)
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue('Jane Doe')
    })
  })

  it('shows success state when profile save succeeds', async () => {
    fetchProfileMock
      .mockResolvedValueOnce({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        role: 'viewer',
      })
      .mockResolvedValue({
        fullName: 'Alex Doe',
        email: 'alex@example.com',
        role: 'editor',
      })
    updateProfileMock.mockResolvedValue({
      fullName: 'Alex Doe',
      email: 'alex@example.com',
      role: 'editor',
    })

    renderWithProviders(<ProfileFormCard />, { route: '/' })
    const user = userEvent.setup()

    const fullNameInput = await screen.findByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email/i)

    await user.clear(fullNameInput)
    await user.type(fullNameInput, 'Alex Doe')
    await user.clear(emailInput)
    await user.type(emailInput, 'alex@example.com')
    await user.click(screen.getByRole('button', { name: /save profile/i }))

    await screen.findByText(/optimistic ui applied instantly/i)
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue('Alex Doe')
    })
  })
})
