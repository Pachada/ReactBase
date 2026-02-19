import { apiClient } from '@/core/api/http-client'
import type {
  ApiUser,
  AuthEnvelope,
  CreateUserRequest,
  DataUserEnvelope,
  EntityId,
  PaginatedUsersEnvelope,
  UpdateUserRequest,
} from '@/core/api/types'

export interface ListUsersParams {
  page?: number
  perPage?: number
}

export const usersApi = {
  listUsers(
    { page = 1, perPage = 50 }: ListUsersParams,
    token: string,
  ): Promise<PaginatedUsersEnvelope | undefined> {
    return apiClient.request<PaginatedUsersEnvelope>(
      `/v1/users?page=${page}&per_page=${perPage}`,
      { token },
    )
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
