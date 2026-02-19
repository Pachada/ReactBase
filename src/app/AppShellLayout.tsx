import { Anchor, AppShell, Breadcrumbs, Text } from '@mantine/core'
import { useDisclosure, useDocumentTitle, useLocalStorage } from '@mantine/hooks'
import { useMemo, useState } from 'react'
import { Link as RouterLink, Outlet, useMatches } from 'react-router-dom'
import { env } from '@/core/config/env'
import { useThemeTokens } from '@/core/theme/ThemeTokensContext'
import { ScrollToTop } from '@/core/ui/ScrollToTop'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'
import { CoachmarkPanel } from './CoachmarkPanel'
import { MobileBottomNav } from './MobileBottomNav'
import { ThemeTokenDrawer } from './ThemeTokenDrawer'

type AppRouteHandle = {
  breadcrumb?: string
  title?: string
  quickSearchPlaceholder?: string
  actions?: Array<{
    label: string
    variant?: 'filled' | 'light' | 'default' | 'subtle'
  }>
}

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
  const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage({
    key: 'reactbase.onboarding.completed',
    defaultValue: false,
    getInitialValueInEffect: true,
  })
  const [coachmarkStep, setCoachmarkStep] = useState(0)
  const { tokens } = useThemeTokens()
  const matches = useMatches()
  const currentHandle = matches.at(-1)?.handle as AppRouteHandle | undefined
  const breadcrumbItems = matches
    .map((match) => {
      const handle = match.handle as AppRouteHandle | undefined
      if (!handle?.breadcrumb) return null
      return { label: handle.breadcrumb, path: match.pathname }
    })
    .filter((item): item is { label: string; path: string } => item !== null)
  const currentPageTitle = currentHandle?.title ?? 'Dashboard'
  const commandPlaceholder =
    currentHandle?.quickSearchPlaceholder ?? `Search ${currentPageTitle.toLowerCase()}`
  const commandActions = currentHandle?.actions ?? []
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

  useDocumentTitle(`${currentPageTitle} | ${tokens.brandName}`)

  const restartOnboarding = () => {
    setOnboardingCompleted(false)
    setCoachmarkStep(0)
  }
  const completeCoachmarks = () => {
    setOnboardingCompleted(true)
    setCoachmarkStep(0)
  }
  const handleCoachmarkNext = () => {
    if (coachmarkStep >= activeCoachmarkSteps.length - 1) {
      completeCoachmarks()
    } else {
      setCoachmarkStep((v) => v + 1)
    }
  }

  return (
    <AppShell
      layout="alt"
      header={{ height: 64 }}
      navbar={{
        width: desktopCollapsed ? 72 : 240,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        header: {
          backdropFilter: 'blur(10px)',
          background: 'color-mix(in srgb, var(--mantine-color-body) 90%, transparent)',
          borderBottom:
            '1px solid color-mix(in srgb, var(--mantine-color-default-border) 50%, transparent)',
        },
        navbar: {
          transition: 'width 0.25s ease, min-width 0.25s ease',
          borderRight:
            '1px solid color-mix(in srgb, var(--mantine-color-default-border) 50%, transparent)',
        },
      }}
    >
      <Anchor href="#main-content" className="skip-link">
        Skip to main content
      </Anchor>

      <AppShell.Header component="header">
        <AppHeader
          opened={opened}
          onToggle={toggle}
          desktopCollapsed={desktopCollapsed ?? false}
          onToggleDesktopCollapsed={() => setDesktopCollapsed((v) => !v)}
          commandPlaceholder={commandPlaceholder}
          commandActions={commandActions}
          onRestartOnboarding={restartOnboarding}
          coachmarkCommandsClass={coachmarkTargetClass('commands')}
          coachmarkBrandingClass={coachmarkTargetClass('branding')}
        />
      </AppShell.Header>

      <AppShell.Navbar
        component="nav"
        aria-label="Primary"
        style={{ display: 'flex', flexDirection: 'column', padding: 0 }}
      >
        <AppSidebar
          desktopCollapsed={desktopCollapsed ?? false}
          coachmarkNavClass={coachmarkTargetClass('nav')}
        />
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
        <ThemeTokenDrawer
          opened={tokensDrawerOpened}
          onClose={tokensDrawerHandlers.close}
        />
      )}

      {currentCoachmark && (
        <CoachmarkPanel
          title={currentCoachmark.title}
          description={currentCoachmark.description}
          step={coachmarkStep}
          totalSteps={activeCoachmarkSteps.length}
          onNext={handleCoachmarkNext}
          onBack={() => setCoachmarkStep((v) => Math.max(0, v - 1))}
          onComplete={completeCoachmarks}
        />
      )}

      <MobileBottomNav onOpenThemeDrawer={tokensDrawerHandlers.open} />

      <ScrollToTop />
    </AppShell>
  )
}
