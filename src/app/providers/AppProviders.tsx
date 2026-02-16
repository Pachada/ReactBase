import {
  MantineProvider,
  createTheme,
  localStorageColorSchemeManager,
} from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { useMemo, type PropsWithChildren } from 'react'
import { AuthProvider, useAuth } from '@/core/auth/AuthContext'

const theme = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
})

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <ThemedProviders>{children}</ThemedProviders>
    </AuthProvider>
  )
}

function ThemedProviders({ children }: PropsWithChildren) {
  const auth = useAuth()
  const colorSchemeManager = useMemo(
    () =>
      localStorageColorSchemeManager({
        key: `reactbase.theme.${auth.user?.email ?? 'anonymous'}`,
      }),
    [auth.user?.email],
  )

  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto"
      colorSchemeManager={colorSchemeManager}
    >
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  )
}
