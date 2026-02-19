import { apiClient } from '@/core/api/http-client'
import type { ApiRole, EntityId, RoleInput } from '@/core/api/types'

interface RolesListEnvelope {
  data?: ApiRole[]
}

export const rolesApi = {
  async listRoles(token: string): Promise<ApiRole[]> {
    const res = await apiClient.request<RolesListEnvelope | ApiRole[] | string[]>(
      '/v1/roles',
      { token },
    )
    if (!res) return []
    const raw = Array.isArray(res) ? res : (res.data ?? [])
    // Normalize: NoSQL returns string[] e.g. ["Admin","User"]
    //            SQL returns ApiRole[] e.g. [{id:1, name:"admin", enable:true}]
    return raw.map((item) =>
      typeof item === 'string' ? { id: item, name: item, enable: true } : item,
    )
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
