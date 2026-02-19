import { apiClient } from '@/core/api/http-client'
import type { ApiStatus, StatusInput } from '@/core/api/types'

interface StatusesListEnvelope {
  data?: ApiStatus[]
}

export const statusesApi = {
  async listStatuses(token: string): Promise<ApiStatus[]> {
    const res = await apiClient.request<StatusesListEnvelope | ApiStatus[]>(
      '/v1/statuses',
      {
        token,
      },
    )
    if (!res) return []
    return Array.isArray(res) ? res : (res.data ?? [])
  },

  createStatus(body: StatusInput, token: string): Promise<ApiStatus | undefined> {
    return apiClient.request<ApiStatus>('/v1/statuses', {
      method: 'POST',
      body,
      token,
    })
  },

  updateStatus(
    id: number,
    body: StatusInput,
    token: string,
  ): Promise<ApiStatus | undefined> {
    return apiClient.request<ApiStatus>(`/v1/statuses/${id}`, {
      method: 'PUT',
      body,
      token,
    })
  },

  deleteStatus(id: number, token: string): Promise<undefined> {
    return apiClient.request<undefined>(`/v1/statuses/${id}`, {
      method: 'DELETE',
      token,
    })
  },
}
