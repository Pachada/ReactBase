import { Button, Group, Modal, Progress, Stack, Text, Title } from '@mantine/core'
import { AlertTriangle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const WARNING_THRESHOLD_MS = 2 * 60 * 1000 // Show warning 2 minutes before expiry

export function SessionTimeoutWarning() {
  const auth = useAuth()
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    const shouldShowWarning = auth.sessionExpiresAt && auth.status === 'authenticated'

    if (!shouldShowWarning) {
      // Use setTimeout to avoid setting state directly in effect
      const timer = setTimeout(() => setIsWarningOpen(false), 0)
      return () => clearTimeout(timer)
    }

    const checkInterval = setInterval(() => {
      const now = Date.now()
      const expiresAt = auth.sessionExpiresAt

      if (!expiresAt) {
        clearInterval(checkInterval)
        return
      }

      const remaining = expiresAt - now

      if (remaining <= 0) {
        // Session expired - logout
        clearInterval(checkInterval)
        auth.logout()
        return
      }

      if (remaining <= WARNING_THRESHOLD_MS) {
        setIsWarningOpen(true)
        setTimeRemaining(remaining)
      } else {
        setIsWarningOpen(false)
      }
    }, 1000)

    return () => clearInterval(checkInterval)
  }, [auth, auth.sessionExpiresAt, auth.status])

  const handleStayLoggedIn = () => {
    auth.resetSessionTimer()
    setIsWarningOpen(false)
  }

  const handleLogout = () => {
    auth.logout()
    setIsWarningOpen(false)
  }

  const secondsRemaining = Math.floor(timeRemaining / 1000)
  const minutesRemaining = Math.floor(secondsRemaining / 60)
  const secondsDisplay = secondsRemaining % 60
  const progressValue = (timeRemaining / WARNING_THRESHOLD_MS) * 100

  return (
    <Modal
      opened={isWarningOpen}
      onClose={handleStayLoggedIn}
      title={
        <Group gap="xs">
          <AlertTriangle size={20} />
          <Title order={4}>Session Expiring Soon</Title>
        </Group>
      }
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      size="md"
    >
      <Stack>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'var(--mantine-color-default-hover)',
            borderRadius: 'var(--mantine-radius-md)',
          }}
        >
          <Clock
            size={48}
            strokeWidth={1.5}
            style={{ color: 'var(--mantine-color-dimmed)' }}
          />
        </div>

        <div>
          <Text size="lg" fw={600} ta="center" mb={4}>
            {minutesRemaining}:{secondsDisplay.toString().padStart(2, '0')}
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            Your session will expire due to inactivity. Would you like to stay logged in?
          </Text>
        </div>

        <Progress
          value={progressValue}
          color={progressValue < 30 ? 'red' : progressValue < 60 ? 'yellow' : 'blue'}
          size="sm"
          radius="xl"
          animated
        />

        <Group grow>
          <Button variant="default" onClick={handleLogout}>
            Sign out
          </Button>
          <Button onClick={handleStayLoggedIn}>Stay logged in</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
