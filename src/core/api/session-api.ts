import { apiClient } from '@/core/api/http-client'
import { urls } from '@/core/config/urls'
import type {
  AuthEnvelope,
  AuthenticatedChangePasswordRequest,
  GoogleOAuthRequest,
  LoginRequest,
  MessageEnvelope,
  RefreshEnvelope,
  RefreshRequest,
  SessionEnvelope,
} from '@/core/api/types'

export const sessionApi = {
  login(body: LoginRequest): Promise<AuthEnvelope | undefined> {
    return apiClient.request<AuthEnvelope>(urls.sessionsLogin(), {
      method: 'POST',
      body,
    })
  },

  logout(token: string): Promise<undefined> {
    return apiClient.request<undefined>(urls.sessionsLogout(), {
      method: 'POST',
      token,
    })
  },

  refresh(refreshToken: string): Promise<RefreshEnvelope | undefined> {
    return apiClient.request<RefreshEnvelope>(urls.sessionsRefresh(), {
      method: 'POST',
      body: { refresh_token: refreshToken } satisfies RefreshRequest,
    })
  },

  getSession(token: string): Promise<SessionEnvelope | undefined> {
    return apiClient.request<SessionEnvelope>(urls.sessions(), { token })
  },

  googleOAuth(credential: string): Promise<AuthEnvelope | undefined> {
    return apiClient.request<AuthEnvelope>(urls.sessionsGoogle(), {
      method: 'POST',
      body: { credential } satisfies GoogleOAuthRequest,
    })
  },

  changePassword(
    body: AuthenticatedChangePasswordRequest,
    token: string,
  ): Promise<MessageEnvelope | undefined> {
    return apiClient.request<MessageEnvelope>(urls.userPassword(), {
      method: 'POST',
      body,
      token,
    })
  },
}
