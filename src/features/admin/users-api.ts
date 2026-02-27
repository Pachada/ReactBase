import { apiClient } from '@/core/api/http-client'
import { urls } from '@/core/config/urls'
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
    return apiClient.request<CursorUsersEnvelope>(urls.users({ limit, cursor }), {
      token,
    })
  },

  getUser(id: EntityId, token: string): Promise<DataUserEnvelope | undefined> {
    return apiClient.request<DataUserEnvelope>(urls.userById(id), { token })
  },

  createUser(body: CreateUserRequest): Promise<AuthEnvelope | undefined> {
    return apiClient.request<AuthEnvelope>(urls.users(), {
      method: 'POST',
      body,
    })
  },

  updateUser(
    id: EntityId,
    body: UpdateUserRequest,
    token: string,
    isAdmin = false,
  ): Promise<ApiUser | undefined> {
    const payload: UpdateUserRequest = { ...body }
    if (!isAdmin) {
      delete payload.role_id
      delete payload.enable
    }
    return apiClient.request<ApiUser>(urls.userById(id), {
      method: 'PUT',
      body: payload,
      token,
    })
  },

  deleteUser(id: EntityId, token: string): Promise<undefined> {
    return apiClient.request<undefined>(urls.userById(id), {
      method: 'DELETE',
      token,
    })
  },
}
