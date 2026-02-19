import { apiClient } from '@/core/api/http-client'
import type {
  AuthEnvelope,
  ChangePasswordRequest,
  LoginRequest,
  MessageEnvelope,
  RefreshEnvelope,
  RefreshRequest,
  SessionEnvelope,
} from '@/core/api/types'

export const sessionApi = {
  login(body: LoginRequest): Promise<AuthEnvelope | undefined> {
    return apiClient.request<AuthEnvelope>('/v1/sessions/login', {
      method: 'POST',
      body,
    })
  },

  logout(token: string): Promise<undefined> {
    return apiClient.request<undefined>('/v1/sessions/logout', {
      method: 'POST',
      token,
    })
  },

  refresh(refreshToken: string): Promise<RefreshEnvelope | undefined> {
    return apiClient.request<RefreshEnvelope>('/v1/sessions/refresh', {
      method: 'POST',
      body: { refresh_token: refreshToken } satisfies RefreshRequest,
    })
  },

  getSession(token: string): Promise<SessionEnvelope | undefined> {
    return apiClient.request<SessionEnvelope>('/v1/sessions', { token })
  },

  changePassword(
    body: ChangePasswordRequest,
    token: string,
  ): Promise<MessageEnvelope | undefined> {
    // NOTE: Reuses the password-recovery endpoint for authenticated password changes.
    // The backend accepts a valid access_token (regular session token) here — no separate
    // "change password while logged in" endpoint exists. If the backend later adds one
    // (e.g. POST /v1/users/me/password) that requires the current password, update here.
    return apiClient.request<MessageEnvelope>('/v1/password-recovery/change-password', {
      method: 'POST',
      body,
      token,
    })
  },
}
