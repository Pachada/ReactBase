import { Loader, Stack, Tabs, Text, Title } from '@mantine/core'
import { Shield, Users, Activity } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/core/auth/AuthContext'
import { rolesApi } from '@/features/admin/roles-api'
import { statusesApi } from '@/features/admin/statuses-api'
import { RolesTab } from '@/features/admin/RolesTab'
import { StatusesTab } from '@/features/admin/StatusesTab'
import { UsersTab } from '@/features/admin/UsersTab'

export function AdminPage() {
  const auth = useAuth()
  const token = auth.token ?? ''

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesApi.listRoles(token),
    enabled: !!token,
  })

  const { data: statuses = [], isLoading: statusesLoading } = useQuery({
    queryKey: ['statuses'],
    queryFn: () => statusesApi.listStatuses(token),
    enabled: !!token,
  })

  return (
    <Stack className="page-enter">
      <div>
        <Title order={2}>Admin area</Title>
        <Text c="dimmed" size="sm">
          Manage users, roles, and statuses.
        </Text>
      </div>

      {rolesLoading || statusesLoading ? (
        <Loader mx="auto" my="xl" />
      ) : (
        <Tabs defaultValue="users">
          <Tabs.List mb="md">
            <Tabs.Tab value="users" leftSection={<Users size={14} />}>
              Users
            </Tabs.Tab>
            <Tabs.Tab value="roles" leftSection={<Shield size={14} />}>
              Roles
            </Tabs.Tab>
            <Tabs.Tab value="statuses" leftSection={<Activity size={14} />}>
              Statuses
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="users">
            <UsersTab roles={roles} />
          </Tabs.Panel>
          <Tabs.Panel value="roles">
            <RolesTab roles={roles} />
          </Tabs.Panel>
          <Tabs.Panel value="statuses">
            <StatusesTab statuses={statuses} />
          </Tabs.Panel>
        </Tabs>
      )}
    </Stack>
  )
}
