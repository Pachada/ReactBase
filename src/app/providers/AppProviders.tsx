import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import type { PropsWithChildren } from 'react'
import { AuthProvider } from '@/core/auth/AuthContext'

const theme = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
})

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" />
      <AuthProvider>{children}</AuthProvider>
    </MantineProvider>
  )
}
