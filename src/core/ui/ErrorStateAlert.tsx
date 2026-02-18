import { Alert, Button, Group, Text } from '@mantine/core'
import { AlertTriangle } from 'lucide-react'

interface ErrorStateAlertProps {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function ErrorStateAlert({
  title,
  message,
  actionLabel,
  onAction,
}: ErrorStateAlertProps) {
  return (
    <Alert
      color="red"
      variant="light"
      title={title}
      icon={<AlertTriangle size={16} />}
      role="alert"
      aria-live="polite"
    >
      <Text size="sm">{message}</Text>
      {actionLabel && onAction && (
        <Group mt="sm">
          <Button size="xs" variant="light" color="red" onClick={onAction}>
            {actionLabel}
          </Button>
        </Group>
      )}
    </Alert>
  )
}
