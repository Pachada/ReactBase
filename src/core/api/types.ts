// ─── Envelopes ───────────────────────────────────────────────────────────────

export interface MessageEnvelope {
  message?: string
  error?: string
  error_code?: number
}

export interface AuthEnvelope {
  access_token: string
  refresh_token: string
  session: ApiSession
}

export interface RefreshEnvelope {
  access_token: string
  refresh_token: string
}

export interface SessionEnvelope {
  session: ApiSession
  message?: string
  error?: string
}

export interface PaginatedUsersEnvelope {
  max_page: number
  actual_page: number
  per_page: number
  data: ApiUser[]
  error?: string
}

export interface DataUserEnvelope {
  id: number
  username: string
  email: string
  phone: string | null
  role_id: number
  first_name: string
  last_name: string
  birthday: string
  verified: boolean
  email_confirmed: boolean
  phone_confirmed: boolean
}

// ─── Models ──────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: number
  username: string
  email: string
  phone: string | null
  role_id: number
  created: string
  updated: string
  enable: boolean
  first_name: string
  last_name: string
  birthday: string
  verified: boolean
  email_confirmed: boolean
  phone_confirmed: boolean
}

export interface ApiSession {
  id: number
  user_id: number
  device_id: number
  created: string
  updated: string
  enable: boolean
  user: ApiUser
}

export interface ApiRole {
  id: number
  name: string
  enable: boolean
}

export interface ApiStatus {
  id: number
  description: string
}

export interface ApiDevice {
  id: number
  uuid: string
  user_id: number
  token: string | null
  app_version_id: number
  created: string
  updated: string
  enable: boolean
}

// ─── Request bodies ───────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string
  password: string
  device_uuid?: string
}

export interface RefreshRequest {
  refresh_token: string
}

export interface CreateUserRequest {
  username: string
  password: string
  email: string
  phone?: string
  first_name: string
  last_name: string
  birthday: string
  device_uuid?: string
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  phone?: string
  first_name?: string
  last_name?: string
  birthday?: string
  role_id?: number
  enable?: boolean
}

export interface RoleInput {
  name: string
  enable?: boolean
}

export interface StatusInput {
  description: string
}

export interface PasswordRecoveryRequest {
  email?: string
  phone_number?: string
}

export interface PasswordRecoveryValidateRequest {
  otp: string
  device_uuid?: string
}

export interface ChangePasswordRequest {
  new_password: string
}

export interface ConfirmEmailValidateRequest {
  token: string
}
