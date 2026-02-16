import { Alert, List, Stack, Text, Title } from '@mantine/core'
import { ShieldAlert } from 'lucide-react'

export function AdminPage() {
  return (
    <Stack className="page-enter">
      <Title order={2}>Admin area</Title>
      <Text c="dimmed">Only users with the admin role can access this route.</Text>
      <Alert icon={<ShieldAlert size={16} />} color="red" title="Restricted surface">
        Keep sensitive controls and audit workflows inside role-protected views like this.
      </Alert>
      <List>
        <List.Item>User and role management</List.Item>
        <List.Item>Security policy configuration</List.Item>
        <List.Item>Audit and operational logs</List.Item>
      </List>
    </Stack>
  )
}
