import { Card, Group, Skeleton, Stack } from '@mantine/core'

export function DashboardStatCardSkeleton() {
  return (
    <Card withBorder shadow="xs" radius="md" className="stat-card shimmer-loading">
      <Group gap="sm" wrap="nowrap">
        <Skeleton height={40} width={40} radius="md" />
        <div style={{ flex: 1 }}>
          <Skeleton height={24} width="60%" mb={6} />
          <Skeleton height={14} width="80%" />
        </div>
      </Group>
      <Skeleton height={14} width="100%" mt="sm" />
    </Card>
  )
}

export function DashboardCardSkeleton() {
  return (
    <Card withBorder shadow="xs" radius="md">
      <Stack>
        <Group>
          <Skeleton height={18} circle />
          <Skeleton height={18} width="40%" />
        </Group>
        <Skeleton height={60} mt="sm" />
      </Stack>
    </Card>
  )
}

export function TableSkeleton() {
  return (
    <Stack gap="xs">
      <Group gap="sm">
        <Skeleton height={36} style={{ flex: 1 }} />
        <Skeleton height={36} style={{ flex: 1 }} />
      </Group>
      <Skeleton height={200} />
      <Group justify="space-between">
        <Skeleton height={20} width={120} />
        <Skeleton height={32} width={200} />
      </Group>
    </Stack>
  )
}

export function ChartSkeleton() {
  return (
    <Stack>
      <Group justify="space-between">
        <Skeleton height={20} width={140} />
        <Skeleton height={28} width={180} />
      </Group>
      <Group gap="sm">
        <Skeleton height={24} width={60} />
        <Skeleton height={24} width={100} />
        <Skeleton height={24} width={60} />
        <Skeleton height={24} width={60} />
        <Skeleton height={28} width={80} />
      </Group>
      <Skeleton height={220} radius="md" className="shimmer-loading" />
    </Stack>
  )
}
