import type { EntityId } from '@/core/api/types'

export const urls = {
  // Sessions
  sessionsLogin: () => '/v1/sessions/login',
  sessionsLogout: () => '/v1/sessions/logout',
  sessionsRefresh: () => '/v1/sessions/refresh',
  sessions: () => '/v1/sessions',
  sessionsGoogle: () => '/v1/sessions/google',

  // Users
  users: (params?: { limit?: number; cursor?: string }) => {
    if (!params) return '/v1/users'
    const p = new URLSearchParams({ limit: String(params.limit ?? 20) })
    if (params.cursor) p.set('cursor', params.cursor)
    return `/v1/users?${p.toString()}`
  },
  userById: (id: EntityId) => `/v1/users/${encodeURIComponent(String(id))}`,
  userPassword: () => '/v1/users/me/password',

  // Roles
  roles: () => '/v1/roles',
  roleById: (id: EntityId) => `/v1/roles/${encodeURIComponent(String(id))}`,

  // Statuses
  statuses: () => '/v1/statuses',
  statusById: (id: number) => `/v1/statuses/${encodeURIComponent(String(id))}`,
}
