import { Box } from '@mantine/core'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'
import { ApiError } from '@/core/api/ApiError'
import { sessionApi } from '@/core/api/session-api'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'
import { env } from '@/core/config/env'

interface GoogleSignInButtonProps {
  redirectTo?: string
  rememberMe?: boolean
}

export function GoogleSignInButton({
  redirectTo = '/',
  rememberMe = false,
}: GoogleSignInButtonProps) {
  const auth = useAuth()
  const navigate = useNavigate()
  const { addNotification } = useNotificationCenter()

  if (!env.googleClientId) return null

  return (
    <Box display="flex" style={{ justifyContent: 'center' }}>
      <GoogleLogin
        width="400"
        onSuccess={async (credentialResponse) => {
          const { credential } = credentialResponse
          if (!credential) {
            addNotification({
              title: 'Sign-in failed',
              message: 'No credential received from Google.',
              color: 'red',
            })
            return
          }
          try {
            const envelope = await sessionApi.googleOAuth(credential)
            if (!envelope) throw new Error('Empty response from server')
            await auth.loginWithEnvelope(envelope, rememberMe)
            addNotification({
              title: 'Welcome',
              message: 'Signed in with Google successfully',
              color: 'green',
            })
            navigate(redirectTo, { replace: true })
          } catch (error) {
            let message = 'Unable to sign in with Google. Please try again.'
            if (error instanceof ApiError && error.status === 401) {
              message = 'Google sign-in was rejected by the server.'
            }
            addNotification({ title: 'Sign-in failed', message, color: 'red' })
          }
        }}
        onError={() => {
          addNotification({
            title: 'Sign-in failed',
            message: 'Google sign-in was cancelled or failed.',
            color: 'red',
          })
        }}
      />
    </Box>
  )
}
