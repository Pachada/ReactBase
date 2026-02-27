import { apiClient } from '@/core/api/http-client'
import { urls } from '@/core/config/urls'
import type { ApiRole, EntityId, RoleInput } from '@/core/api/types'

interface RolesListEnvelope {
  data?: ApiRole[]
}

export const rolesApi = {
  async listRoles(token: string): Promise<ApiRole[]> {
    const res = await apiClient.request<RolesListEnvelope | ApiRole[] | string[]>(
      urls.roles(),
      { token },
    )
    if (!res) return []
    const raw = Array.isArray(res) ? res : (res.data ?? [])
    // Normalize: NoSQL returns string[] e.g. ["Admin","User"]
    //            SQL returns ApiRole[] e.g. [{id:1, name:"admin", enable:true}]
    // Note: for string items we synthesize an ApiRole using the role name as both `id`
    //       and `name`. This means NoSQL-backed roles use string IDs while SQL-backed
    //       roles use numeric IDs. Treat `id` as an opaque identifier — do not compare
    //       IDs across different backend types.
    return raw.map((item) =>
      typeof item === 'string' ? { id: item, name: item, enable: true } : item,
    )
  },

  getRole(id: EntityId, token: string): Promise<ApiRole | undefined> {
    return apiClient.request<ApiRole>(urls.roleById(id), { token })
  },

  createRole(body: RoleInput, token: string): Promise<ApiRole | undefined> {
    return apiClient.request<ApiRole>(urls.roles(), {
      method: 'POST',
      body,
      token,
    })
  },

  updateRole(id: EntityId, body: RoleInput, token: string): Promise<ApiRole | undefined> {
    return apiClient.request<ApiRole>(urls.roleById(id), {
      method: 'PUT',
      body,
      token,
    })
  },

  deleteRole(id: EntityId, token: string): Promise<undefined> {
    return apiClient.request<undefined>(urls.roleById(id), {
      method: 'DELETE',
      token,
    })
  },
}
