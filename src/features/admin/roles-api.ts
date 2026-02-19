import { apiClient } from '@/core/api/http-client'
import type { ApiRole, EntityId, RoleInput } from '@/core/api/types'

interface RolesListEnvelope {
  data?: ApiRole[]
}

export const rolesApi = {
  async listRoles(token: string): Promise<ApiRole[]> {
    const res = await apiClient.request<RolesListEnvelope | ApiRole[]>('/v1/roles', {
      token,
    })
    if (!res) return []
    return Array.isArray(res) ? res : (res.data ?? [])
  },

  getRole(id: EntityId, token: string): Promise<ApiRole | undefined> {
    return apiClient.request<ApiRole>(`/v1/roles/${id}`, { token })
  },

  createRole(body: RoleInput, token: string): Promise<ApiRole | undefined> {
    return apiClient.request<ApiRole>('/v1/roles', {
      method: 'POST',
      body,
      token,
    })
  },

  updateRole(id: EntityId, body: RoleInput, token: string): Promise<ApiRole | undefined> {
    return apiClient.request<ApiRole>(`/v1/roles/${id}`, {
      method: 'PUT',
      body,
      token,
    })
  },

  deleteRole(id: EntityId, token: string): Promise<undefined> {
    return apiClient.request<undefined>(`/v1/roles/${id}`, {
      method: 'DELETE',
      token,
    })
  },
}
