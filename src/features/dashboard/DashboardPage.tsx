import {
  Alert,
  Badge,
  Card,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { Layers, Palette, ShieldCheck, Workflow } from 'lucide-react'
import { useAuth } from '@/core/auth/AuthContext'
import { ProfileFormCard } from '@/features/dashboard/ProfileFormCard'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const stats = [
  {
    label: 'Auth model',
    value: 'RBAC',
    icon: ShieldCheck,
    color: 'teal',
    description: 'Role-based access control',
  },
  {
    label: 'API boundary',
    value: 'Typed',
    icon: Workflow,
    color: 'indigo',
    description: 'Centralized HTTP client',
  },
  {
    label: 'Color presets',
    value: '6',
    icon: Palette,
    color: 'grape',
    description: 'White-label theming',
  },
  {
    label: 'UI components',
    value: '30+',
    icon: Layers,
    color: 'orange',
    description: 'Mantine-powered',
  },
] as const

export function DashboardPage() {
  const auth = useAuth()
  const [layoutPreset, setLayoutPreset] = useLocalStorage<'compact' | 'detailed'>({
    key: 'reactbase.dashboard.layout-preset',
    defaultValue: 'detailed',
    getInitialValueInEffect: true,
  })

  return (
    <Stack className="page-enter">
      <Group justify="space-between" align="end">
        <div>
          <Text size="sm" c="dimmed" mb={2}>
            {getGreeting()}
            {auth.user ? `, ${auth.user.name}` : ''}
          </Text>
          <Title order={2}>Dashboard</Title>
        </div>
        <Stack gap={4} align="end">
          <Badge variant="light" size="sm">
            Layout
          </Badge>
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
      <SimpleGrid cols={{ base: 2, md: 4 }}>
        {stats.map((stat) => (
          <Card key={stat.label} withBorder shadow="xs" radius="md" className="stat-card">
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon variant="light" color={stat.color} size="lg" radius="md">
                <stat.icon size={16} />
              </ThemeIcon>
              <div>
                <Text size="xl" fw={700} lh={1.2}>
                  {stat.value}
                </Text>
                <Text size="xs" c="dimmed" lh={1.3}>
                  {stat.label}
                </Text>
              </div>
            </Group>
            {layoutPreset === 'detailed' && (
              <Text size="xs" c="dimmed" mt="sm">
                {stat.description}
              </Text>
            )}
          </Card>
        ))}
      </SimpleGrid>
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
      <Alert variant="light" color="indigo" title="Demo credentials" radius="md">
        Use any username and role, and password <b>changeme</b> to sign in.
      </Alert>
      <ProfileFormCard />
    </Stack>
  )
}
