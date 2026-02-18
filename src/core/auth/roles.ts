import type { ApiRole } from '@/core/api/types'

export function buildRoleLabel(roleName: string): string {
  if (!roleName) return 'Unknown'
  return roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase()
}

export function buildRoleOptions(roles: ApiRole[]) {
  return roles.map((r) => ({ value: String(r.id), label: buildRoleLabel(r.name) }))
}
