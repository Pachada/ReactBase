import {
  Alert,
  Anchor,
  Button,
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
import { Link, useNavigate } from 'react-router-dom'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'
import { ROLE_OPTIONS } from '@/core/auth/roles'
import type { Role } from '@/core/auth/types'

interface SignUpFormValues {
  username: string
  email: string
  password: string
  confirmPassword: string
  role: Role
}

export function SignUpPage() {
  const navigate = useNavigate()
  const { addNotification } = useNotificationCenter()
  const { colorScheme } = useMantineColorScheme()
  const { register, control, handleSubmit, formState, setError } =
    useForm<SignUpFormValues>({
      defaultValues: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'viewer',
      },
      mode: 'onBlur',
    })

  const onSubmit = handleSubmit(async (values) => {
    // Check password match
    if (values.password !== values.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' })
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would create an account via API
      addNotification({
        title: 'Account created',
        message: `Welcome ${values.username}! Redirecting to sign in...`,
        color: 'green',
      })

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1500)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create account. Please try again.'
      addNotification({
        title: 'Sign-up failed',
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
              Create account
            </Title>
            <Text size="sm" c="dimmed">
              Sign up to get started with ReactBase
            </Text>
          </div>

          <Alert color="blue" variant="light" radius="md">
            Demo mode — Account won&apos;t actually be created
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

              <TextInput
                label="Email"
                placeholder="alex@example.com"
                size="md"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={formState.errors.email?.message}
              />

              <PasswordInput
                label="Password"
                placeholder="••••••••"
                size="md"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                error={formState.errors.password?.message}
              />

              <PasswordInput
                label="Confirm password"
                placeholder="••••••••"
                size="md"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                })}
                error={formState.errors.confirmPassword?.message}
              />

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

              <Button type="submit" size="md" loading={formState.isSubmitting} fullWidth>
                Create account
              </Button>
            </Stack>
          </form>

          <Text size="xs" c="dimmed" ta="center">
            Already have an account?{' '}
            <Anchor component={Link} to="/login" size="xs">
              Sign in
            </Anchor>
          </Text>
        </Stack>
      </div>
    </div>
  )
}
