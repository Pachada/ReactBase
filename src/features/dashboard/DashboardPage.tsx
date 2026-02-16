import { Alert, Card, Group, Stack, Text, Title } from '@mantine/core'
import { ShieldCheck, Workflow } from 'lucide-react'
import { ProfileFormCard } from '@/features/dashboard/ProfileFormCard'

export function DashboardPage() {
  return (
    <Stack>
      <Title order={2}>Dashboard</Title>
      <Text c="dimmed">
        This starter includes a typed auth model, RBAC routing, API abstractions, and
        reusable form patterns.
      </Text>
      <Group grow align="stretch">
        <Card withBorder shadow="xs" radius="md">
          <Group>
            <ShieldCheck size={18} />
            <Text fw={600}>Security-first baseline</Text>
          </Group>
          <Text size="sm" c="dimmed" mt="sm">
            Protected routes and role gates are ready to integrate with your real auth
            backend.
          </Text>
        </Card>
        <Card withBorder shadow="xs" radius="md">
          <Group>
            <Workflow size={18} />
            <Text fw={600}>Typed API boundary</Text>
          </Group>
          <Text size="sm" c="dimmed" mt="sm">
            Use the shared HTTP client and centralized error model for predictable API
            handling.
          </Text>
        </Card>
      </Group>
      <Alert variant="light" color="indigo" title="Demo credentials">
        Use any username and role, and password <b>changeme</b> to sign in.
      </Alert>
      <ProfileFormCard />
    </Stack>
  )
}
