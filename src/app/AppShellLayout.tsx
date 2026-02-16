import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import {
  LayoutDashboard,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
} from 'lucide-react'
import { NavLink as RouterNavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'
import { ROLE_LABEL } from '@/core/auth/roles'

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
