import {
  ActionIcon,
  Anchor,
  AppShell,
  Breadcrumbs,
  Burger,
  Button,
  ColorSwatch,
  Drawer,
  Group,
  Indicator,
  Menu,
  NavLink,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure, useDocumentTitle, useLocalStorage } from '@mantine/hooks'
import {
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  Library,
  LogOut,
  Moon,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  ShieldCheck,
  Sun,
  User,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  Outlet,
  useLocation,
  useMatches,
} from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'
import { ROLE_LABEL } from '@/core/auth/roles'
import type { Role } from '@/core/auth/types'
import { env } from '@/core/config/env'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'
import { usePrimaryColorSettings } from '@/core/theme/PrimaryColorContext'
import { PRIMARY_COLOR_PRESETS } from '@/core/theme/color-presets'
import { useThemeTokens } from '@/core/theme/ThemeTokensContext'
import { FontPicker } from '@/core/ui/FontPicker'
import { ScrollToTop } from '@/core/ui/ScrollToTop'

type AppRouteHandle = {
  breadcrumb?: string
  title?: string
  quickSearchPlaceholder?: string
  actions?: Array<{
    label: string
    variant?: 'filled' | 'light' | 'default' | 'subtle'
  }>
}

type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
  roles?: Role[]
}

type NavGroup = {
  id: string
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/components', label: 'Components', icon: Library },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    items: [{ to: '/admin', label: 'Admin', icon: ShieldCheck, roles: ['admin'] }],
  },
]

const coachmarkSteps = [
  {
    id: 'navigation',
    title: 'Grouped navigation',
    description:
      'Use collapsible nav groups to keep routes organized and only show role-allowed pages.',
    target: 'nav',
  },
  {
    id: 'commands',
    title: 'Global command area',
    description:
      'Use quick search and action slots for route-level commands and shortcuts.',
    target: 'commands',
  },
  {
    id: 'branding',
    title: 'Theme token editor',
    description:
      'Open branding settings to customize brand name, radius, and font family per project.',
    target: 'branding',
  },
] as const

export function AppShellLayout() {
  const themeTokenEditorEnabled = env.themeTokenEditorEnabled
  const [opened, { toggle }] = useDisclosure()
  const [tokensDrawerOpened, tokensDrawerHandlers] = useDisclosure()
  const [desktopCollapsed, setDesktopCollapsed] = useLocalStorage({
    key: 'reactbase.navbar.desktop-collapsed',
    defaultValue: false,
    getInitialValueInEffect: true,
  })
  const [collapsedGroups, setCollapsedGroups] = useLocalStorage<Record<string, boolean>>({
    key: 'reactbase.navbar.group-collapsed',
    defaultValue: {
      workspace: true,
      administration: true,
    },
    getInitialValueInEffect: true,
  })
  const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage({
    key: 'reactbase.onboarding.completed',
    defaultValue: false,
    getInitialValueInEffect: true,
  })
  const [coachmarkStep, setCoachmarkStep] = useState(0)
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  })
  const { primaryColor, setPrimaryColor } = usePrimaryColorSettings()
  const { tokens, updateTokens, resetTokens } = useThemeTokens()
  const {
    items: notificationItems,
    addNotification,
    clearNotifications,
  } = useNotificationCenter()
  const auth = useAuth()
  const location = useLocation()
  const matches = useMatches()
  const currentHandle = matches.at(-1)?.handle as AppRouteHandle | undefined
  const breadcrumbItems = matches
    .map((match) => {
      const handle = match.handle as AppRouteHandle | undefined
      if (!handle?.breadcrumb) {
        return null
      }
      return {
        label: handle.breadcrumb,
        path: match.pathname,
      }
    })
    .filter((item): item is { label: string; path: string } => item !== null)
  const currentPageTitle = currentHandle?.title ?? 'Dashboard'
  const commandPlaceholder =
    currentHandle?.quickSearchPlaceholder ?? `Search ${currentPageTitle.toLowerCase()}`
  const commandActions = currentHandle?.actions ?? []
  const isActiveLink = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
  const activeCoachmarkSteps = useMemo(
    () =>
      themeTokenEditorEnabled
        ? coachmarkSteps
        : coachmarkSteps.filter((step) => step.target !== 'branding'),
    [themeTokenEditorEnabled],
  )
  const currentCoachmark =
    !onboardingCompleted && coachmarkStep < activeCoachmarkSteps.length
      ? activeCoachmarkSteps[coachmarkStep]
      : null
  const coachmarkTargetClass = (target: string) =>
    currentCoachmark?.target === target ? 'coachmark-target' : undefined
  const visibleNavGroups = useMemo(
    () =>
      navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !item.roles || auth.hasRole(item.roles)),
        }))
        .filter((group) => group.items.length > 0),
    [auth],
  )

  useDocumentTitle(`${currentPageTitle} | ${tokens.brandName}`)

  const toggleGroup = (groupId: string) =>
    setCollapsedGroups((value) => ({
      ...value,
      [groupId]: !(value[groupId] ?? true),
    }))

  const completeCoachmarks = () => {
    setOnboardingCompleted(true)
    setCoachmarkStep(0)
  }

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: desktopCollapsed ? 80 : 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        header: {
          backdropFilter: 'blur(12px)',
          background: 'color-mix(in srgb, var(--mantine-color-body) 82%, transparent)',
        },
        navbar: {
          transition: 'width 0.25s ease, min-width 0.25s ease',
        },
      }}
    >
      <Anchor href="#main-content" className="skip-link">
        Skip to main content
      </Anchor>
      <AppShell.Header component="header">
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
            <Title
              order={4}
              component={RouterLink}
              to="/"
              style={{ textDecoration: 'none', color: 'inherit' }}
              aria-label="Go to dashboard"
            >
              {tokens.brandName}
            </Title>
            <Text size="sm" c="dimmed" visibleFrom="sm">
              {currentPageTitle}
            </Text>
          </Group>
          <Group
            flex={1}
            mx="md"
            visibleFrom="md"
            wrap="nowrap"
            className={coachmarkTargetClass('commands')}
          >
            <TextInput
              aria-label="Quick search"
              placeholder={commandPlaceholder}
              leftSection={<Search size={14} />}
              style={{ flex: 1, maxWidth: 420 }}
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
          <Group className={coachmarkTargetClass('branding')}>
            <Tooltip label="Open onboarding coachmarks" withArrow>
              <ActionIcon
                variant="subtle"
                aria-label="Restart onboarding tour"
                onClick={() => {
                  setOnboardingCompleted(false)
                  setCoachmarkStep(0)
                }}
              >
                <HelpCircle size={18} />
              </ActionIcon>
            </Tooltip>
            {themeTokenEditorEnabled && (
              <Tooltip label="Open theme token editor" withArrow>
                <ActionIcon
                  variant="subtle"
                  aria-label="Open theme token editor"
                  onClick={tokensDrawerHandlers.open}
                >
                  <Settings2 size={18} />
                </ActionIcon>
              </Tooltip>
            )}
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
              <Text size="sm" c="dimmed" visibleFrom="sm">
                {auth.user.name} ({ROLE_LABEL[auth.user.role]})
              </Text>
            )}
            <Menu shadow="md" width={220} position="bottom-end">
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  aria-label="User menu"
                  size="lg"
                  hiddenFrom="sm"
                >
                  <User size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>
                  {auth.user?.name}
                  <Text size="xs" c="dimmed">
                    {auth.user && ROLE_LABEL[auth.user.role]}
                  </Text>
                </Menu.Label>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<LogOut size={16} />}
                  onClick={auth.logout}
                  color="red"
                >
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Tooltip label="Sign out" withArrow visibleFrom="sm">
              <ActionIcon
                variant="light"
                color="red"
                onClick={auth.logout}
                aria-label="Sign out"
                visibleFrom="sm"
              >
                <LogOut size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" component="nav" aria-label="Primary">
        <Stack gap="xs" align={desktopCollapsed ? 'center' : 'stretch'}>
          {visibleNavGroups.map((group) => {
            const isGroupOpen = collapsedGroups[group.id] ?? true
            return (
              <Stack
                key={group.id}
                gap={4}
                align={desktopCollapsed ? 'center' : 'stretch'}
                className={
                  group.id === 'workspace' ? coachmarkTargetClass('nav') : undefined
                }
              >
                {!desktopCollapsed && (
                  <Button
                    variant="subtle"
                    justify="space-between"
                    onClick={() => toggleGroup(group.id)}
                    rightSection={
                      isGroupOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    }
                  >
                    {group.label}
                  </Button>
                )}
                {(desktopCollapsed || isGroupOpen) &&
                  group.items.map((link) => (
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
                                    outline:
                                      '2px solid var(--mantine-primary-color-filled)',
                                    outlineOffset: '2px',
                                  },
                                },
                                label: { display: 'none' },
                                section: { marginInlineEnd: 0 },
                              }
                            : {
                                root: {
                                  '&:focus-visible': {
                                    outline:
                                      '2px solid var(--mantine-primary-color-filled)',
                                    outlineOffset: '2px',
                                  },
                                },
                              }
                        }
                      />
                    </Tooltip>
                  ))}
              </Stack>
            )
          })}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main component="main" id="main-content" tabIndex={-1}>
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

      {themeTokenEditorEnabled && (
        <Drawer
          opened={tokensDrawerOpened}
          onClose={tokensDrawerHandlers.close}
          title="Theme token editor"
          position="right"
        >
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
              <Button onClick={tokensDrawerHandlers.close}>Done</Button>
            </Group>
          </Stack>
        </Drawer>
      )}

      {currentCoachmark && (
        <div className="coachmark-panel" role="dialog" aria-live="polite">
          <Stack gap={6}>
            <Text size="sm" fw={600}>
              {currentCoachmark.title}
            </Text>
            <Text size="sm" c="dimmed">
              {currentCoachmark.description}
            </Text>
            <Group justify="space-between" mt={4}>
              <Button
                size="compact-xs"
                variant="subtle"
                onClick={() => setCoachmarkStep((value) => Math.max(0, value - 1))}
                disabled={coachmarkStep === 0}
              >
                Back
              </Button>
              <Group gap={6}>
                <Button size="compact-xs" variant="default" onClick={completeCoachmarks}>
                  Skip
                </Button>
                <Button
                  size="compact-xs"
                  onClick={() =>
                    coachmarkStep >= activeCoachmarkSteps.length - 1
                      ? completeCoachmarks()
                      : setCoachmarkStep((value) => value + 1)
                  }
                >
                  {coachmarkStep >= activeCoachmarkSteps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Group>
            </Group>
          </Stack>
        </div>
      )}

      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <div className="mobile-bottom-nav-inner">
          <RouterLink
            to="/"
            className={`mobile-nav-item ${isActiveLink('/') ? 'active' : ''}`}
          >
            <LayoutDashboard />
            <span>Dashboard</span>
          </RouterLink>
          <RouterLink
            to="/components"
            className={`mobile-nav-item ${isActiveLink('/components') ? 'active' : ''}`}
          >
            <Library />
            <span>Components</span>
          </RouterLink>
          {auth.hasRole(['admin']) && (
            <RouterLink
              to="/admin"
              className={`mobile-nav-item ${isActiveLink('/admin') ? 'active' : ''}`}
            >
              <ShieldCheck />
              <span>Admin</span>
            </RouterLink>
          )}
          <button
            className="mobile-nav-item"
            onClick={tokensDrawerHandlers.open}
            aria-label="Settings"
          >
            <Settings2 />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* Scroll to top button */}
      <ScrollToTop />
    </AppShell>
  )
}
