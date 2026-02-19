import { apiClient } from '@/core/api/http-client'
import type {
  ApiUser,
  AuthEnvelope,
  CreateUserRequest,
  CursorUsersEnvelope,
  DataUserEnvelope,
  EntityId,
  UpdateUserRequest,
} from '@/core/api/types'

export interface ListUsersParams {
  limit?: number
  cursor?: string
}

export const usersApi = {
  listUsers(
    { limit = 20, cursor }: ListUsersParams,
    token: string,
  ): Promise<CursorUsersEnvelope | undefined> {
    const params = new URLSearchParams({ limit: String(limit) })
    if (cursor) params.set('cursor', cursor)
    return apiClient.request<CursorUsersEnvelope>(`/v1/users?${params.toString()}`, {
      token,
    })
  },

  getUser(id: EntityId, token: string): Promise<DataUserEnvelope | undefined> {
    return apiClient.request<DataUserEnvelope>(`/v1/users/${id}`, { token })
  },

  createUser(body: CreateUserRequest): Promise<AuthEnvelope | undefined> {
    return apiClient.request<AuthEnvelope>('/v1/users', {
      method: 'POST',
      body,
    })
  },

  updateUser(
    id: EntityId,
    body: UpdateUserRequest,
    token: string,
  ): Promise<ApiUser | undefined> {
    return apiClient.request<ApiUser>(`/v1/users/${id}`, {
      method: 'PUT',
      body,
      token,
    })
  },

  deleteUser(id: EntityId, token: string): Promise<undefined> {
    return apiClient.request<undefined>(`/v1/users/${id}`, {
      method: 'DELETE',
      token,
    })
  },
}
