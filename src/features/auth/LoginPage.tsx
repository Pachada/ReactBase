import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import { Zap } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'
import { ErrorStateAlert } from '@/core/ui/ErrorStateAlert'
import { ROLE_OPTIONS } from '@/core/auth/roles'
import type { Role } from '@/core/auth/types'
import { getRememberMePreference } from '@/core/auth/auth-storage'

interface LoginFormValues {
  username: string
  password: string
  role: Role
  rememberMe: boolean
}

interface RouterState {
  from?: {
    pathname?: string
  }
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const { addNotification } = useNotificationCenter()
  const { colorScheme } = useMantineColorScheme()
  const state = (location.state as RouterState | null) ?? {}
  const redirectTo = state.from?.pathname ?? '/'
  const { register, control, handleSubmit, formState, setError } =
    useForm<LoginFormValues>({
      defaultValues: {
        username: '',
        password: '',
        role: 'viewer',
        rememberMe: getRememberMePreference(),
      },
      mode: 'onBlur',
    })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await auth.login(values, values.rememberMe)
      addNotification({
        title: 'Welcome back',
        message: `Signed in as ${values.role}`,
        color: 'green',
      })
      navigate(redirectTo, { replace: true })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to sign in right now. Please try again.'
      addNotification({
        title: 'Sign-in failed',
        message,
        color: 'red',
      })
      setError('root', { message })
    }
  })

  return (
    <div className="login-shell">
      <div className={`login-hero ${colorScheme === 'light' ? 'login-hero-light' : ''}`}>
        <div className="login-accent login-accent-1" />
        <div className="login-accent login-accent-2" />
        <div className="login-accent login-accent-3" />
        <div className="login-hero-badge">
          <Zap size={12} />
          Production-ready skeleton
        </div>
        <h1 className="login-hero-title">ReactBase</h1>
        <p className="login-hero-tagline">
          Typed auth, RBAC routing, white-label theming, and a polished component
          foundation — ready for your next product.
        </p>
      </div>

      <div className="login-form-side">
        <Stack maw={400} w="100%" className="login-form-enter">
          <div>
            <Title order={2} mb={4}>
              Welcome back
            </Title>
            <Text size="sm" c="dimmed">
              Sign in to continue. Demo password is <b>changeme</b>.
            </Text>
          </div>
          <Alert color="blue" variant="light" radius="md">
            Starter auth flow — replace with your API integration.
          </Alert>
          <form onSubmit={onSubmit}>
            <Stack>
              <TextInput
                label="Username"
                placeholder="alex"
                size="md"
                {...register('username', { required: 'Username is required' })}
                error={formState.errors.username?.message}
              />
              <PasswordInput
                label="Password"
                placeholder="changeme"
                size="md"
                {...register('password', { required: 'Password is required' })}
                error={formState.errors.password?.message}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Checkbox label="Remember me" size="sm" {...register('rememberMe')} />
                <Anchor component={Link} to="/forgot-password" size="sm">
                  Forgot password?
                </Anchor>
              </div>
              <Controller
                control={control}
                name="role"
                rules={{ required: 'Role is required' }}
                render={({ field, fieldState }) => (
                  <Select
                    label="Role"
                    data={ROLE_OPTIONS}
                    size="md"
                    value={field.value}
                    onChange={(value) => field.onChange((value ?? 'viewer') as Role)}
                    error={fieldState.error?.message}
                  />
                )}
              />
              {formState.errors.root && (
                <ErrorStateAlert
                  title="Authentication error"
                  message={
                    formState.errors.root.message ?? 'Unable to sign in right now.'
                  }
                  actionLabel='Use demo password "changeme"'
                  onAction={() => {
                    const message = formState.errors.root?.message
                    if (!message) {
                      return
                    }

                    addNotification({
                      title: 'Tip',
                      message: 'Use password "changeme" and submit again.',
                      color: 'blue',
                    })
                  }}
                />
              )}
              <Button type="submit" size="md" loading={formState.isSubmitting}>
                Sign in
              </Button>
            </Stack>
          </form>
          <Text size="xs" c="dimmed" ta="center">
            Don&apos;t have an account?{' '}
            <Anchor component={Link} to="/signup" size="xs">
              Sign up
            </Anchor>
            {' · '}
            <Anchor component={Link} to="/components" size="xs">
              Preview components
            </Anchor>
          </Text>
        </Stack>
      </div>
    </div>
  )
}
