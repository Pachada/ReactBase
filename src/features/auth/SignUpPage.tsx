import {
  Anchor,
  Button,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import 'dayjs/locale/en'
import { Zap } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { usersApi } from '@/features/admin/users-api'
import { useAuth } from '@/core/auth/AuthContext'
import { ApiError } from '@/core/api/ApiError'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'
import { DATE_FORMAT, formatYMD, handleDateKeyDown } from '@/core/utils/date'

interface SignUpFormValues {
  username: string
  email: string
  phone: string
  first_name: string
  last_name: string
  birthday: Date | null
  password: string
  confirmPassword: string
}

export function SignUpPage() {
  const navigate = useNavigate()
  const { loginWithEnvelope } = useAuth()
  const { addNotification } = useNotificationCenter()
  const { colorScheme } = useMantineColorScheme()
  const { register, control, handleSubmit, formState, setError } =
    useForm<SignUpFormValues>({
      defaultValues: {
        username: '',
        email: '',
        phone: '',
        first_name: '',
        last_name: '',
        birthday: null,
        password: '',
        confirmPassword: '',
      },
      mode: 'onBlur',
    })

  const onSubmit = handleSubmit(async (values) => {
    if (values.password !== values.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' })
      return
    }

    const birthdayYMD = values.birthday instanceof Date ? formatYMD(values.birthday) : ''

    try {
      const envelope = await usersApi.createUser({
        username: values.username,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        birthday: birthdayYMD,
      })

      if (envelope) {
        const envelopeAny = envelope as unknown as Record<string, unknown>
        const emailConfirmed =
          envelopeAny.email_confirmed ??
          (envelopeAny.user as Record<string, unknown> | undefined)?.email_confirmed
        if (emailConfirmed === false) {
          addNotification({
            title: 'Verify your email',
            message:
              'Your account has been created. Please verify your email address before signing in.',
            color: 'blue',
          })
          navigate('/login', { replace: true })
        } else {
          await loginWithEnvelope(envelope)
          addNotification({
            title: 'Account created',
            message: `Welcome ${values.username}!`,
            color: 'green',
          })
          navigate('/', { replace: true })
        }
      }
    } catch (error) {
      let message = 'Unable to create account. Please try again.'
      if (error instanceof ApiError) {
        if (error.status === 409) {
          // Deliberately vague — avoid confirming whether username/email exists (enumeration)
          message =
            'An account with these details may already exist. Try signing in instead.'
        }
      }
      addNotification({ title: 'Sign-up failed', message, color: 'red' })
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
              Sign up to get started
            </Text>
          </div>

          <form onSubmit={onSubmit}>
            <Stack>
              <TextInput
                label="Username"
                placeholder="alex"
                size="md"
                {...register('username', { required: 'Username is required' })}
                error={formState.errors.username?.message}
              />

              <SimpleGrid cols={2}>
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
                <TextInput
                  label="Phone"
                  placeholder="+1 555 000 0000"
                  size="md"
                  type="tel"
                  {...register('phone', {
                    validate: (value) => {
                      if (!value || value.trim() === '') return true
                      return (
                        /^\+?[0-9\s\-().]{7,20}$/.test(value) ||
                        'Please enter a valid phone number'
                      )
                    },
                  })}
                  error={formState.errors.phone?.message}
                />
              </SimpleGrid>

              <SimpleGrid cols={2}>
                <TextInput
                  label="First name"
                  placeholder="Alex"
                  size="md"
                  {...register('first_name', { required: 'First name is required' })}
                  error={formState.errors.first_name?.message}
                />
                <TextInput
                  label="Last name"
                  placeholder="Smith"
                  size="md"
                  {...register('last_name', { required: 'Last name is required' })}
                  error={formState.errors.last_name?.message}
                />
              </SimpleGrid>

              <Controller
                control={control}
                name="birthday"
                render={({ field }) => (
                  <DateInput
                    label="Birthday"
                    placeholder={DATE_FORMAT}
                    size="md"
                    valueFormat={DATE_FORMAT}
                    value={field.value}
                    onChange={field.onChange}
                    clearable
                    popoverProps={{ withinPortal: true }}
                    onKeyDown={handleDateKeyDown}
                    maxDate={new Date()}
                  />
                )}
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

              {formState.errors.root && (
                <Text size="sm" c="red">
                  {formState.errors.root.message}
                </Text>
              )}

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
