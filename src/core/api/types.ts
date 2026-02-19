// ─── Shared primitives ───────────────────────────────────────────────────────

/** Accepts both SQL integer IDs and NoSQL UUID strings */
export type EntityId = number | string

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
  user: ApiUser
}

export interface RefreshEnvelope {
  access_token: string
  refresh_token: string
}

export interface SessionEnvelope {
  session: ApiSession
  user?: ApiUser
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

export interface CursorUsersEnvelope {
  data: ApiUser[]
  returned: number
  next_cursor?: string
}

export interface DataUserEnvelope {
  id: number
  username: string
  email: string
  phone: string | null
  role_id: number
  first_name: string
  last_name: string
  birthday: string | null
  verified: boolean
  email_confirmed: boolean
  phone_confirmed: boolean
}

// ─── Go nullable field wrappers ───────────────────────────────────────────────

/** Go's sql.NullString serialised to JSON */
export interface NullString {
  String: string
  Valid: boolean
}

/** Go's sql.NullTime serialised to JSON */
export interface NullTime {
  Time: string
  Valid: boolean
}

// ─── Models ──────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: EntityId
  username: string
  email: string
  phone: string | null
  role_id: EntityId
  role?: string // NoSQL: role name returned directly instead of role_id
  created: string
  updated: string
  enable: boolean
  first_name: string
  last_name: string
  birthday: string | null
  verified: boolean
  email_confirmed: boolean
  phone_confirmed: boolean
}

export interface ApiSession {
  id: EntityId
  user_id: EntityId
  device_id?: EntityId
  created: string
  updated: string
  enable: boolean
}

export interface ApiRole {
  id: EntityId
  name: string
  enable: boolean
}

export interface ApiStatus {
  id: number
  description: string
}

export interface ApiDevice {
  id: EntityId
  uuid: string
  user_id: EntityId
  token: string | null
  app_version_id: EntityId
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
  role_id?: EntityId
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
