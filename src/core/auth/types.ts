import type { EntityId } from '@/core/api/types'

// Role is a string name as returned by the API (e.g. 'admin', 'editor', 'viewer')
export type Role = string

export interface AuthUser {
  id: EntityId
  username: string
  name: string // first_name + last_name
  email: string
  role_id: EntityId
  roleName: Role
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  status: 'anonymous' | 'authenticated'
}

export interface LoginCredentials {
  username: string
  password: string
}
