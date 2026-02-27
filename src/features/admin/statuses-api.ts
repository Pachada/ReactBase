import { apiClient } from '@/core/api/http-client'
import { urls } from '@/core/config/urls'
import type { ApiStatus, StatusInput } from '@/core/api/types'

interface StatusesListEnvelope {
  data?: ApiStatus[]
}

export const statusesApi = {
  async listStatuses(token: string): Promise<ApiStatus[]> {
    const res = await apiClient.request<StatusesListEnvelope | ApiStatus[]>(
      urls.statuses(),
      {
        token,
      },
    )
    if (!res) return []
    return Array.isArray(res) ? res : (res.data ?? [])
  },

  createStatus(body: StatusInput, token: string): Promise<ApiStatus | undefined> {
    return apiClient.request<ApiStatus>(urls.statuses(), {
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
    return apiClient.request<ApiStatus>(urls.statusById(id), {
      method: 'PUT',
      body,
      token,
    })
  },

  deleteStatus(id: number, token: string): Promise<undefined> {
    return apiClient.request<undefined>(urls.statusById(id), {
      method: 'DELETE',
      token,
    })
  },
}
