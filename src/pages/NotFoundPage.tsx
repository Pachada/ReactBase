import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Center mih="100vh" p="md">
      <Stack align="center" gap="lg">
        <div className="not-found-code" aria-hidden>
          404
        </div>
        <Title order={2} ta="center">
          Page not found
        </Title>
        <Text c="dimmed" maw={360} ta="center" size="lg">
          The page you&apos;re looking for may have been moved or no longer exists.
        </Text>
        <Button
          component={Link}
          to="/"
          size="md"
          variant="light"
          leftSection={<ArrowLeft size={16} />}
        >
          Back to dashboard
        </Button>
      </Stack>
    </Center>
  )
}
