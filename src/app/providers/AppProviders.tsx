import {
  MantineProvider,
  createTheme,
  localStorageColorSchemeManager,
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo, useState, type PropsWithChildren } from 'react'
import { AuthProvider, useAuth } from '@/core/auth/AuthContext'
import { SessionTimeoutWarning } from '@/core/auth/SessionTimeoutWarning'
import { NotificationCenterProvider } from '@/core/notifications/NotificationCenterContext'
import { PrimaryColorContext } from '@/core/theme/PrimaryColorContext'
import {
  DEFAULT_THEME_TOKENS,
  ThemeTokensContext,
  type ThemeTokens,
} from '@/core/theme/ThemeTokensContext'
import {
  CUSTOM_THEME_COLORS,
  DEFAULT_PRIMARY_COLOR_PRESET,
  isPrimaryColorPreset,
  type PrimaryColorPreset,
} from '@/core/theme/color-presets'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <ThemedProviders>{children}</ThemedProviders>
    </AuthProvider>
  )
}

function ThemedProviders({ children }: PropsWithChildren) {
  const auth = useAuth()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  )
  const [tokens, setTokens] = useLocalStorage<ThemeTokens>({
    key: `reactbase.theme-tokens.${auth.user?.email ?? 'anonymous'}`,
    defaultValue: DEFAULT_THEME_TOKENS,
    getInitialValueInEffect: true,
  })
  const [storedPrimaryColor, setStoredPrimaryColor] = useLocalStorage({
    key: `reactbase.primary-color.${auth.user?.email ?? 'anonymous'}`,
    defaultValue: DEFAULT_PRIMARY_COLOR_PRESET,
    getInitialValueInEffect: true,
  })
  const primaryColor = isPrimaryColorPreset(storedPrimaryColor)
    ? storedPrimaryColor
    : DEFAULT_PRIMARY_COLOR_PRESET

  const colorSchemeManager = useMemo(
    () =>
      localStorageColorSchemeManager({
        key: `reactbase.theme.${auth.user?.email ?? 'anonymous'}`,
      }),
    [auth.user?.email],
  )
  const theme = useMemo(
    () =>
      createTheme({
        colors: CUSTOM_THEME_COLORS,
        primaryColor,
        defaultRadius: tokens.radius,
        fontFamily: tokens.fontFamily,
      }),
    [primaryColor, tokens.fontFamily, tokens.radius],
  )

  const primaryColorContextValue = useMemo(
    () => ({
      primaryColor,
      setPrimaryColor: (value: PrimaryColorPreset) => setStoredPrimaryColor(value),
    }),
    [primaryColor, setStoredPrimaryColor],
  )
  const themeTokensContextValue = useMemo(
    () => ({
      tokens,
      updateTokens: (nextTokens: Partial<ThemeTokens>) =>
        setTokens((previousTokens) => ({ ...previousTokens, ...nextTokens })),
      resetTokens: () => setTokens(DEFAULT_THEME_TOKENS),
    }),
    [setTokens, tokens],
  )

  return (
    <ThemeTokensContext.Provider value={themeTokensContextValue}>
      <PrimaryColorContext.Provider value={primaryColorContextValue}>
        <MantineProvider
          theme={theme}
          defaultColorScheme="light"
          colorSchemeManager={colorSchemeManager}
        >
          <QueryClientProvider client={queryClient}>
            <SessionTimeoutWarning />
            <NotificationCenterProvider>
              <Notifications position={tokens.notificationPosition} />
              {children}
            </NotificationCenterProvider>
          </QueryClientProvider>
        </MantineProvider>
      </PrimaryColorContext.Provider>
    </ThemeTokensContext.Provider>
  )
}
