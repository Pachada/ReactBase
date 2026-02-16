import {
  AppShell,
  Burger,
  Button,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { LayoutDashboard, Library, ShieldCheck } from 'lucide-react'
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
  const auth = useAuth()

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
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
        <Stack gap="xs">
          {links.map((link) => (
            <NavLink
              key={link.to}
              label={link.label}
              leftSection={<link.icon size={16} />}
              component={RouterNavLink}
              to={link.to}
            />
          ))}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
