import {
  Alert,
  Badge,
  Card,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { ShieldCheck, Workflow } from 'lucide-react'
import { ProfileFormCard } from '@/features/dashboard/ProfileFormCard'

export function DashboardPage() {
  const [layoutPreset, setLayoutPreset] = useLocalStorage<'compact' | 'detailed'>({
    key: 'reactbase.dashboard.layout-preset',
    defaultValue: 'detailed',
    getInitialValueInEffect: true,
  })

  return (
    <Stack>
      <Group justify="space-between" align="end">
        <div>
          <Title order={2}>Dashboard</Title>
          <Text c="dimmed">
            This starter includes a typed auth model, RBAC routing, API abstractions, and
            reusable form patterns.
          </Text>
        </div>
        <Stack gap={4} align="end">
          <Badge variant="light">Layout preset</Badge>
          <SegmentedControl
            size="xs"
            value={layoutPreset}
            onChange={(value) => setLayoutPreset(value as 'compact' | 'detailed')}
            data={[
              { value: 'compact', label: 'Compact' },
              { value: 'detailed', label: 'Detailed' },
            ]}
          />
        </Stack>
      </Group>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Card withBorder shadow="xs" radius="md">
          <Group>
            <ShieldCheck size={18} />
            <Text fw={600}>Security-first baseline</Text>
          </Group>
          {layoutPreset === 'detailed' && (
            <Text size="sm" c="dimmed" mt="sm">
              Protected routes and role gates are ready to integrate with your real auth
              backend.
            </Text>
          )}
        </Card>
        <Card withBorder shadow="xs" radius="md">
          <Group>
            <Workflow size={18} />
            <Text fw={600}>Typed API boundary</Text>
          </Group>
          {layoutPreset === 'detailed' && (
            <Text size="sm" c="dimmed" mt="sm">
              Use the shared HTTP client and centralized error model for predictable API
              handling.
            </Text>
          )}
        </Card>
      </SimpleGrid>
      <Alert variant="light" color="indigo" title="Demo credentials">
        Use any username and role, and password <b>changeme</b> to sign in.
      </Alert>
      <ProfileFormCard />
    </Stack>
  )
}
