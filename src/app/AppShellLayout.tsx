import {
  ActionIcon,
  Anchor,
  AppShell,
  Breadcrumbs,
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
import { useDocumentTitle, useDisclosure, useLocalStorage } from '@mantine/hooks'
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
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  Outlet,
  useLocation,
  useMatches,
} from 'react-router-dom'
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
  const location = useLocation()
  const matches = useMatches()
  const breadcrumbItems = matches
    .map((match) => {
      const handle = match.handle as { breadcrumb?: string } | undefined
      if (!handle?.breadcrumb) {
        return null
      }
      return {
        label: handle.breadcrumb,
        path: match.pathname,
      }
    })
    .filter((item): item is { label: string; path: string } => item !== null)
  const currentPageTitle =
    (matches.at(-1)?.handle as { title?: string } | undefined)?.title ?? 'Dashboard'
  const isActiveLink = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  useDocumentTitle(`${currentPageTitle} | ReactBase`)

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
            <Text size="sm" c="dimmed" visibleFrom="sm">
              {currentPageTitle}
            </Text>
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
                active={isActiveLink(link.to)}
                aria-label={link.label}
                styles={
                  desktopCollapsed
                    ? {
                        root: {
                          width: 48,
                          justifyContent: 'center',
                          '&:focus-visible': {
                            outline: '2px solid var(--mantine-primary-color-filled)',
                            outlineOffset: '2px',
                          },
                        },
                        label: { display: 'none' },
                        section: { marginInlineEnd: 0 },
                      }
                    : {
                        root: {
                          '&:focus-visible': {
                            outline: '2px solid var(--mantine-primary-color-filled)',
                            outlineOffset: '2px',
                          },
                        },
                      }
                }
              />
            </Tooltip>
          ))}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        {breadcrumbItems.length > 0 && (
          <Breadcrumbs mb="sm">
            {breadcrumbItems.map((item, index) =>
              index === breadcrumbItems.length - 1 ? (
                <Text key={item.path} size="sm" c="dimmed">
                  {item.label}
                </Text>
              ) : (
                <Anchor key={item.path} component={RouterLink} to={item.path} size="sm">
                  {item.label}
                </Anchor>
              ),
            )}
          </Breadcrumbs>
        )}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
