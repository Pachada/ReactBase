import { apiClient } from '@/core/api/http-client'
import type {
  ApiUser,
  CreateUserRequest,
  DataUserEnvelope,
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

  getUser(id: number, token: string): Promise<DataUserEnvelope | undefined> {
    return apiClient.request<DataUserEnvelope>(`/v1/users/${id}`, { token })
  },

  createUser(body: CreateUserRequest): Promise<ApiUser | undefined> {
    return apiClient.request<ApiUser>('/v1/users', {
      method: 'POST',
      body,
    })
  },

  updateUser(
    id: number,
    body: UpdateUserRequest,
    token: string,
  ): Promise<ApiUser | undefined> {
    return apiClient.request<ApiUser>(`/v1/users/${id}`, {
      method: 'PUT',
      body,
      token,
    })
  },

  deleteUser(id: number, token: string): Promise<undefined> {
    return apiClient.request<undefined>(`/v1/users/${id}`, {
      method: 'DELETE',
      token,
    })
  },
}
