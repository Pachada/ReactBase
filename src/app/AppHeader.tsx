import {
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Button,
  Group,
  Indicator,
  Menu,
  Stack,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from '@mantine/core'
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
} from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'
import { buildRoleLabel } from '@/core/auth/roles'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'

interface AppHeaderProps {
  opened: boolean
  onToggle: () => void
  desktopCollapsed: boolean
  onToggleDesktopCollapsed: () => void
  commandPlaceholder: string
  commandActions: Array<{
    label: string
    variant?: 'filled' | 'light' | 'default' | 'subtle'
  }>
  onRestartOnboarding: () => void
  coachmarkCommandsClass?: string
  coachmarkBrandingClass?: string
}

export function AppHeader({
  opened,
  onToggle,
  desktopCollapsed,
  onToggleDesktopCollapsed,
  commandPlaceholder,
  commandActions,
  onRestartOnboarding,
  coachmarkCommandsClass,
  coachmarkBrandingClass,
}: AppHeaderProps) {
  const auth = useAuth()
  const {
    items: notificationItems,
    addNotification,
    clearNotifications,
  } = useNotificationCenter()

  return (
    <Group h="100%" px="md" justify="space-between">
      {/* Left: mobile burger + desktop collapse */}
      <Group gap="xs">
        <Burger opened={opened} onClick={onToggle} hiddenFrom="sm" size="sm" />
        <Tooltip
          label={desktopCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          withArrow
          visibleFrom="sm"
        >
          <ActionIcon
            visibleFrom="sm"
            variant="subtle"
            aria-label={desktopCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            onClick={onToggleDesktopCollapsed}
          >
            {desktopCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* Center: search + command actions */}
      <Group
        flex={1}
        mx="md"
        visibleFrom="md"
        wrap="nowrap"
        className={coachmarkCommandsClass}
      >
        <TextInput
          aria-label="Quick search"
          placeholder={commandPlaceholder}
          leftSection={<Search size={14} />}
          style={{ flex: 1, maxWidth: 480 }}
        />
        <Group gap="xs" wrap="nowrap">
          {commandActions.slice(0, 2).map((action) => (
            <Button
              key={action.label}
              size="xs"
              variant={action.variant ?? 'default'}
              onClick={() =>
                addNotification({
                  title: action.label,
                  message: 'Command action slot placeholder.',
                })
              }
            >
              {action.label}
            </Button>
          ))}
        </Group>
      </Group>

      {/* Right: help + notifications + user profile */}
      <Group gap="xs" className={coachmarkBrandingClass}>
        <Tooltip label="Open onboarding guide" withArrow>
          <ActionIcon
            variant="subtle"
            aria-label="Restart onboarding tour"
            onClick={onRestartOnboarding}
          >
            <HelpCircle size={18} />
          </ActionIcon>
        </Tooltip>

        {/* Notifications */}
        <Menu shadow="md" width={320} position="bottom-end">
          <Menu.Target>
            <Indicator
              disabled={notificationItems.length === 0}
              inline
              label={notificationItems.length}
              size={16}
            >
              <ActionIcon variant="subtle" aria-label="Open notification center">
                <Bell size={18} />
              </ActionIcon>
            </Indicator>
          </Menu.Target>
          <Menu.Dropdown>
            <Group justify="space-between" px="sm" py={6}>
              <Text size="sm" fw={600}>
                Notifications
              </Text>
              <Button
                size="compact-xs"
                variant="subtle"
                onClick={clearNotifications}
                disabled={notificationItems.length === 0}
              >
                Clear
              </Button>
            </Group>
            {notificationItems.length === 0 ? (
              <Menu.Label>No notifications yet</Menu.Label>
            ) : (
              notificationItems.slice(0, 6).map((item) => (
                <Menu.Item key={item.id}>
                  <Stack gap={2}>
                    <Text size="sm" fw={600}>
                      {item.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {item.message}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </Text>
                  </Stack>
                </Menu.Item>
              ))
            )}
          </Menu.Dropdown>
        </Menu>

        {/* User profile — consolidated settings + sign out */}
        <Menu shadow="md" width={240} position="bottom-end">
          <Menu.Target>
            <UnstyledButton className="user-profile-btn" aria-label="User menu">
              <Group gap="xs" wrap="nowrap">
                <Avatar size={32} radius="xl" color="primary">
                  {auth.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </Avatar>
                <Box visibleFrom="sm" style={{ lineHeight: 1, minWidth: 0 }}>
                  <Text
                    size="sm"
                    fw={600}
                    lh={1.3}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {auth.user?.name ?? 'Guest'}
                  </Text>
                  <Text size="xs" c="dimmed" lh={1.2}>
                    {auth.user ? buildRoleLabel(auth.user.roleName) : ''}
                  </Text>
                </Box>
                <ChevronDown
                  size={14}
                  style={{ color: 'var(--mantine-color-dimmed)', flexShrink: 0 }}
                />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>
              {auth.user?.name}
              <Text size="xs" c="dimmed">
                {auth.user && buildRoleLabel(auth.user.roleName)}
              </Text>
            </Menu.Label>
            <Menu.Divider />
            <Menu.Item
              leftSection={<Settings size={16} />}
              component={RouterLink}
              to="/settings"
            >
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<LogOut size={16} />}
              color="red"
              onClick={auth.logout}
            >
              Sign out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}
