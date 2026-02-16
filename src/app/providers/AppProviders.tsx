import {
  MantineProvider,
  createTheme,
  localStorageColorSchemeManager,
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { Notifications } from '@mantine/notifications'
import { useMemo, type PropsWithChildren } from 'react'
import { AuthProvider, useAuth } from '@/core/auth/AuthContext'
import { PrimaryColorContext } from '@/core/theme/PrimaryColorContext'
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
        defaultRadius: 'md',
      }),
    [primaryColor],
  )

  const primaryColorContextValue = useMemo(
    () => ({
      primaryColor,
      setPrimaryColor: (value: PrimaryColorPreset) => setStoredPrimaryColor(value),
    }),
    [primaryColor, setStoredPrimaryColor],
  )

  return (
    <PrimaryColorContext.Provider value={primaryColorContextValue}>
      <MantineProvider
        theme={theme}
        defaultColorScheme="auto"
        colorSchemeManager={colorSchemeManager}
      >
        <Notifications position="top-right" />
        {children}
      </MantineProvider>
    </PrimaryColorContext.Provider>
  )
}
