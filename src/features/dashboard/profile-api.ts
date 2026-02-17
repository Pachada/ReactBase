import type { Role } from '@/core/auth/types'

export interface Profile {
  fullName: string
  email: string
  role: Role
}

let mockProfile: Profile = {
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  role: 'viewer',
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchProfile(): Promise<Profile> {
  await wait(450)
  return { ...mockProfile }
}

export async function updateProfile(nextProfile: Profile): Promise<Profile> {
  await wait(700)

  if (nextProfile.email.toLowerCase().includes('fail')) {
    throw new Error('Sync rejected by server. Please retry with a different email.')
  }

  mockProfile = { ...nextProfile }
  return { ...mockProfile }
}
