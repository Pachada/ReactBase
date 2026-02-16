import type { Role } from '@/core/auth/types'

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}

export const ROLE_OPTIONS = Object.entries(ROLE_LABEL).map(([value, label]) => ({
  value: value as Role,
  label,
}))
