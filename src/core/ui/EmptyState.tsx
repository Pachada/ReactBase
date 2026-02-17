import { Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  illustration?: 'no-data' | 'no-results' | 'no-notifications'
  action?: ReactNode
}

function NoDataIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <rect
        x="20"
        y="30"
        width="80"
        height="60"
        rx="8"
        stroke="var(--mantine-color-dimmed)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 4"
      />
      <circle cx="40" cy="50" r="4" fill="var(--mantine-color-dimmed)" opacity="0.4" />
      <circle cx="60" cy="55" r="4" fill="var(--mantine-color-dimmed)" opacity="0.4" />
      <circle cx="80" cy="52" r="4" fill="var(--mantine-color-dimmed)" opacity="0.4" />
      <line
        x1="40"
        y1="50"
        x2="60"
        y2="55"
        stroke="var(--mantine-color-dimmed)"
        strokeWidth="2"
        opacity="0.3"
      />
      <line
        x1="60"
        y1="55"
        x2="80"
        y2="52"
        stroke="var(--mantine-color-dimmed)"
        strokeWidth="2"
        opacity="0.3"
      />
    </svg>
  )
}

function NoResultsIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle
        cx="60"
        cy="50"
        r="28"
        stroke="var(--mantine-color-dimmed)"
        strokeWidth="2.5"
        fill="none"
      />
      <line
        x1="80"
        y1="70"
        x2="95"
        y2="85"
        stroke="var(--mantine-color-dimmed)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="42"
        x2="70"
        y2="58"
        stroke="var(--mantine-color-red-6)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="70"
        y1="42"
        x2="50"
        y2="58"
        stroke="var(--mantine-color-red-6)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function NoNotificationsIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <path
        d="M60 30C60 30 50 30 50 40V60C50 60 50 70 40 70H80C70 70 70 60 70 60V40C70 30 60 30 60 30Z"
        stroke="var(--mantine-color-dimmed)"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M54 70C54 72 55 75 60 75C65 75 66 72 66 70"
        stroke="var(--mantine-color-dimmed)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="60" cy="28" r="3" fill="var(--mantine-color-dimmed)" opacity="0.5" />
      <line
        x1="30"
        y1="30"
        x2="90"
        y2="90"
        stroke="var(--mantine-color-red-6)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  illustration,
  action,
}: EmptyStateProps) {
  return (
    <Stack align="center" gap="md" py="xl">
      {illustration === 'no-data' && <NoDataIllustration />}
      {illustration === 'no-results' && <NoResultsIllustration />}
      {illustration === 'no-notifications' && <NoNotificationsIllustration />}
      {Icon && !illustration && <Icon size={48} strokeWidth={1.5} opacity={0.5} />}
      <Stack align="center" gap={4}>
        <Title order={4}>{title}</Title>
        <Text size="sm" c="dimmed" ta="center" maw={320}>
          {description}
        </Text>
      </Stack>
      {action}
    </Stack>
  )
}
