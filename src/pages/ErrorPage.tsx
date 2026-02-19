import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import type { FallbackProps } from 'react-error-boundary'

export function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.'

  return (
    <Center mih="100vh" p="md">
      <Stack align="center" gap="lg">
        <AlertTriangle size={48} style={{ color: 'var(--mantine-color-red-6)' }} />
        <Title order={2} ta="center">
          Something went wrong
        </Title>
        <Text c="dimmed" maw={400} ta="center" size="lg">
          {message}
        </Text>
        <Button
          variant="light"
          leftSection={<RotateCcw size={16} />}
          onClick={resetErrorBoundary}
        >
          Try again
        </Button>
      </Stack>
    </Center>
  )
}
