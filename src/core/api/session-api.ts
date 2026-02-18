import { apiClient } from '@/core/api/http-client'
import type {
  AuthEnvelope,
  LoginRequest,
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
}
