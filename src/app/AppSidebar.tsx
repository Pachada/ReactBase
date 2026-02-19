import { Anchor, Box, Divider, NavLink, Stack, Text, Tooltip } from '@mantine/core'
import { LayoutDashboard, LayoutGrid, Library, LogOut, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  useLocation,
} from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'
import type { Role } from '@/core/auth/types'
import { useThemeTokens } from '@/core/theme/ThemeTokensContext'

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

interface AppSidebarProps {
  desktopCollapsed: boolean
  coachmarkNavClass?: string
}

export function AppSidebar({ desktopCollapsed, coachmarkNavClass }: AppSidebarProps) {
  const auth = useAuth()
  const { tokens } = useThemeTokens()
  const location = useLocation()

  const isActiveLink = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  const visibleNavItems = useMemo(
    () =>
      navGroups.flatMap((group) =>
        group.items.filter((item) => !item.roles || auth.hasRole(item.roles)),
      ),
    [auth],
  )

  return (
    <>
      {/* Brand logo */}
      <Box
        px={desktopCollapsed ? 0 : 'md'}
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: desktopCollapsed ? 'center' : 'flex-start',
          flexShrink: 0,
        }}
      >
        <Anchor
          component={RouterLink}
          to="/"
          style={{ textDecoration: 'none', color: 'inherit' }}
          aria-label="Go to dashboard"
        >
          <Stack
            gap="sm"
            align="center"
            style={{ flexDirection: 'row', flexWrap: 'nowrap' }}
          >
            <Box className="sidebar-brand-icon" aria-hidden>
              <LayoutGrid size={16} />
            </Box>
            {!desktopCollapsed && (
              <Box style={{ overflow: 'hidden', minWidth: 0 }}>
                <Text fw={700} size="sm" lh={1.2} style={{ whiteSpace: 'nowrap' }}>
                  {tokens.brandName}
                </Text>
                <Text
                  size="xs"
                  c="dimmed"
                  style={{
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Owner Portal
                </Text>
              </Box>
            )}
          </Stack>
        </Anchor>
      </Box>

      {/* Nav items */}
      <Box
        style={{ flex: 1, overflowY: 'auto' }}
        px="xs"
        py="xs"
        className={coachmarkNavClass}
      >
        <Stack gap={2} align={desktopCollapsed ? 'center' : 'stretch'}>
          {visibleNavItems.map((link) => (
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
                          '&:focusVisible': {
                            outline: '2px solid var(--mantine-primary-color-filled)',
                            outlineOffset: '2px',
                          },
                        },
                        label: { display: 'none' },
                        section: { marginInlineEnd: 0 },
                      }
                    : {
                        root: {
                          '&:focusVisible': {
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
      </Box>

      {/* Logout pinned at bottom */}
      <Divider opacity={0.4} />
      <Box px="xs" py="xs">
        <Tooltip label="Sign out" position="right" disabled={!desktopCollapsed} withArrow>
          <NavLink
            label="Logout"
            leftSection={<LogOut size={16} />}
            onClick={auth.logout}
            color="red"
            aria-label="Sign out"
            styles={
              desktopCollapsed
                ? {
                    root: { width: 48, justifyContent: 'center' },
                    label: { display: 'none' },
                    section: { marginInlineEnd: 0 },
                  }
                : {}
            }
          />
        </Tooltip>
      </Box>
    </>
  )
}
