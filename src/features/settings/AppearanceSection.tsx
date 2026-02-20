import {
  Box,
  Button,
  ColorSwatch,
  Divider,
  Group,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { Check, Monitor, Moon, RotateCcw, Sun } from 'lucide-react'
import type React from 'react'
import { usePrimaryColorSettings } from '@/core/theme/PrimaryColorContext'
import { PRIMARY_COLOR_PRESETS } from '@/core/theme/color-presets'
import { useThemeTokens } from '@/core/theme/ThemeTokensContext'
import { FontPicker } from '@/core/ui/FontPicker'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'

// ─── Appearance section ───────────────────────────────────────────────────────

export function AppearanceSection() {
  const { setColorScheme, colorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  })
  const { primaryColor, setPrimaryColor } = usePrimaryColorSettings()
  const { tokens, updateTokens, resetTokens } = useThemeTokens()
  const { addNotification } = useNotificationCenter()

  function handleSwatchKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const idx = PRIMARY_COLOR_PRESETS.findIndex((p) => p.value === primaryColor)
    let next = idx
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
      next = (idx + 1) % PRIMARY_COLOR_PRESETS.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (idx - 1 + PRIMARY_COLOR_PRESETS.length) % PRIMARY_COLOR_PRESETS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = PRIMARY_COLOR_PRESETS.length - 1
    setPrimaryColor(PRIMARY_COLOR_PRESETS[next].value)
    const buttons = e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')
    buttons[next]?.focus()
  }

  // Reflect 'auto' vs explicit scheme
  const schemeValue = colorScheme === 'auto' ? 'auto' : computedColorScheme

  return (
    <Stack gap="lg">
      {/* Color scheme */}
      <Paper withBorder radius="md" p="lg">
        <Stack gap="md">
          <Box>
            <Title order={5} mb={4}>
              Color scheme
            </Title>
            <Text size="sm" c="dimmed">
              Choose between light, dark, or follow your system setting.
            </Text>
          </Box>
          <SegmentedControl
            value={schemeValue}
            onChange={(v) => setColorScheme(v as 'light' | 'dark' | 'auto')}
            style={{ alignSelf: 'flex-start' }}
            data={[
              {
                value: 'light',
                label: (
                  <Group gap={6} wrap="nowrap">
                    <Sun size={13} />
                    <span>Light</span>
                  </Group>
                ),
              },
              {
                value: 'dark',
                label: (
                  <Group gap={6} wrap="nowrap">
                    <Moon size={13} />
                    <span>Dark</span>
                  </Group>
                ),
              },
              {
                value: 'auto',
                label: (
                  <Group gap={6} wrap="nowrap">
                    <Monitor size={13} />
                    <span>System</span>
                  </Group>
                ),
              },
            ]}
          />
        </Stack>
      </Paper>

      {/* Accent color */}
      <Paper withBorder radius="md" p="lg">
        <Stack gap="md">
          <Box>
            <Title order={5} mb={4}>
              Accent color
            </Title>
            <Text size="sm" c="dimmed">
              Sets the primary color used across buttons, links, and highlights.
            </Text>
          </Box>
          <Group
            gap="sm"
            wrap="wrap"
            role="radiogroup"
            aria-label="Accent color"
            onKeyDown={handleSwatchKeyDown}
          >
            {PRIMARY_COLOR_PRESETS.map((preset) => (
              <Tooltip key={preset.value} label={preset.label} withArrow>
                <UnstyledButton
                  onClick={() => setPrimaryColor(preset.value)}
                  aria-label={`Select ${preset.label} color`}
                  role="radio"
                  aria-checked={primaryColor === preset.value}
                  tabIndex={primaryColor === preset.value ? 0 : -1}
                >
                  <ColorSwatch
                    color={preset.previewColor}
                    size={32}
                    style={{
                      cursor: 'pointer',
                      boxShadow:
                        primaryColor === preset.value
                          ? '0 0 0 2px var(--mantine-color-body), 0 0 0 4px var(--mantine-primary-color-filled)'
                          : undefined,
                      transition: 'box-shadow 0.15s ease',
                    }}
                  >
                    {primaryColor === preset.value && (
                      <Check
                        size={14}
                        style={{
                          color: '#fff',
                          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))',
                        }}
                      />
                    )}
                  </ColorSwatch>
                </UnstyledButton>
              </Tooltip>
            ))}
          </Group>
        </Stack>
      </Paper>

      {/* Typography & layout */}
      <Paper withBorder radius="md" p="lg">
        <Stack gap="md">
          <Box>
            <Title order={5} mb={4}>
              Typography &amp; layout
            </Title>
            <Text size="sm" c="dimmed">
              Customize fonts, radius, and notification placement.
            </Text>
          </Box>
          <FontPicker
            value={tokens.fontFamily}
            onChange={(value) => updateTokens({ fontFamily: value })}
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Select
              label="Border radius"
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
                { value: 'top-right', label: 'Top right' },
                { value: 'bottom-right', label: 'Bottom right' },
                { value: 'bottom-center', label: 'Bottom center' },
              ]}
            />
          </SimpleGrid>
          <Divider />
          <Group>
            <Button
              variant="subtle"
              color="gray"
              leftSection={<RotateCcw size={13} />}
              size="sm"
              onClick={() => {
                resetTokens()
                addNotification({
                  title: 'Appearance reset',
                  message: 'All appearance settings have been reset to defaults.',
                  color: 'blue',
                })
              }}
            >
              Reset to defaults
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  )
}
