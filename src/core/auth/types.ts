export type Role = 'admin' | 'editor' | 'viewer'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  status: 'anonymous' | 'authenticated'
}

export interface LoginCredentials {
  username: string
  password: string
  role: Role
}
