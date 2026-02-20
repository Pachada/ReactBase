import { Button, Drawer, Group, Select, Stack, Text, TextInput } from '@mantine/core'
import { useThemeTokens } from '@/core/theme/ThemeTokensContext'
import { FontPicker } from '@/core/ui/FontPicker'

interface ThemeTokenDrawerProps {
  opened: boolean
  onClose: () => void
}

export function ThemeTokenDrawer({ opened, onClose }: ThemeTokenDrawerProps) {
  const { tokens, updateTokens, resetTokens } = useThemeTokens()

  return (
    <Drawer opened={opened} onClose={onClose} title="Theme token editor" position="right">
      <Stack>
        <Text size="sm" c="dimmed">
          Configure white-label tokens for this workspace.
        </Text>
        <TextInput
          label="Brand name"
          value={tokens.brandName}
          onChange={(event) => updateTokens({ brandName: event.currentTarget.value })}
        />
        <Select
          label="Radius scale"
          value={tokens.radius}
          onChange={(value) =>
            updateTokens({
              radius: (value as 'sm' | 'md' | 'lg' | 'xl') ?? tokens.radius,
            })
          }
          data={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
            { value: 'xl', label: 'Extra large' },
          ]}
        />
        <FontPicker
          value={tokens.fontFamily}
          onChange={(value) => updateTokens({ fontFamily: value })}
        />
        <Select
          label="Notification position"
          value={tokens.notificationPosition}
          onChange={(value) =>
            updateTokens({
              notificationPosition:
                (value as 'top-right' | 'bottom-right' | 'bottom-center') ??
                tokens.notificationPosition,
            })
          }
          data={[
            { value: 'top-right', label: 'Top Right' },
            { value: 'bottom-right', label: 'Bottom Right' },
            { value: 'bottom-center', label: 'Bottom Center' },
          ]}
        />
        <Group justify="space-between">
          <Button variant="subtle" onClick={resetTokens}>
            Reset defaults
          </Button>
          <Button onClick={onClose}>Done</Button>
        </Group>
      </Stack>
    </Drawer>
  )
}
