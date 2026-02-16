import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  ColorSwatch,
  Group,
  Menu,
  NavLink,
  Stack,
  Text,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import {
  Check,
  LayoutDashboard,
  Library,
  Moon,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Sun,
} from 'lucide-react'
import { NavLink as RouterNavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'
import { ROLE_LABEL } from '@/core/auth/roles'
import { usePrimaryColorSettings } from '@/core/theme/PrimaryColorContext'
import { PRIMARY_COLOR_PRESETS } from '@/core/theme/color-presets'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/components', label: 'Components', icon: Library },
  { to: '/admin', label: 'Admin', icon: ShieldCheck },
]

export function AppShellLayout() {
  const [opened, { toggle }] = useDisclosure()
  const [desktopCollapsed, setDesktopCollapsed] = useLocalStorage({
    key: 'reactbase.navbar.desktop-collapsed',
    defaultValue: false,
    getInitialValueInEffect: true,
  })
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  })
  const { primaryColor, setPrimaryColor } = usePrimaryColorSettings()
  const auth = useAuth()

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: desktopCollapsed ? 80 : 260,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <ActionIcon
              visibleFrom="sm"
              variant="subtle"
              aria-label={
                desktopCollapsed
                  ? 'Expand desktop navigation'
                  : 'Collapse desktop navigation'
              }
              onClick={() => setDesktopCollapsed((value) => !value)}
            >
              {desktopCollapsed ? (
                <PanelLeftOpen size={18} />
              ) : (
                <PanelLeftClose size={18} />
              )}
            </ActionIcon>
            <Title order={4}>ReactBase</Title>
          </Group>
          <Group>
            <Tooltip
              label={
                computedColorScheme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
              withArrow
            >
              <ActionIcon
                variant="subtle"
                aria-label={
                  computedColorScheme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
                onClick={() =>
                  setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')
                }
              >
                {computedColorScheme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </ActionIcon>
            </Tooltip>
            <Menu shadow="md" width={220} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" aria-label="Select primary color preset">
                  <Palette size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Color preset</Menu.Label>
                {PRIMARY_COLOR_PRESETS.map((preset) => (
                  <Menu.Item
                    key={preset.value}
                    leftSection={<ColorSwatch color={preset.previewColor} size={14} />}
                    rightSection={
                      primaryColor === preset.value ? (
                        <Check size={14} aria-hidden />
                      ) : null
                    }
                    onClick={() => setPrimaryColor(preset.value)}
                  >
                    {preset.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            {auth.user && (
              <Text size="sm" c="dimmed">
                {auth.user.name} ({ROLE_LABEL[auth.user.role]})
              </Text>
            )}
            <Button variant="light" onClick={auth.logout}>
              Sign out
            </Button>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack gap="xs" align={desktopCollapsed ? 'center' : 'stretch'}>
          {links.map((link) => (
            <Tooltip
              key={link.to}
              label={link.label}
              position="right"
              disabled={!desktopCollapsed}
              withArrow
            >
              <NavLink
                label={link.label}
                leftSection={<link.icon size={16} />}
                component={RouterNavLink}
                to={link.to}
                aria-label={link.label}
                styles={
                  desktopCollapsed
                    ? {
                        root: { width: 48, justifyContent: 'center' },
                        label: { display: 'none' },
                        section: { marginInlineEnd: 0 },
                      }
                    : undefined
                }
              />
            </Tooltip>
          ))}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
