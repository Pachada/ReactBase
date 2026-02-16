import {
  Alert,
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'
import { ROLE_OPTIONS } from '@/core/auth/roles'
import type { Role } from '@/core/auth/types'

interface LoginFormValues {
  username: string
  password: string
  role: Role
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
  const state = (location.state as RouterState | null) ?? {}
  const redirectTo = state.from?.pathname ?? '/'
  const { register, control, handleSubmit, formState } = useForm<LoginFormValues>({
    defaultValues: {
      username: '',
      password: '',
      role: 'viewer',
    },
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(async (values) => {
    await auth.login(values)
    addNotification({
      title: 'Welcome back',
      message: `Signed in as ${values.role}`,
      color: 'green',
    })
    navigate(redirectTo, { replace: true })
  })

  return (
    <Paper maw={440} mx="auto" mt={80} withBorder shadow="sm" p="xl" radius="md">
      <Stack>
        <Title order={2}>Sign in</Title>
        <Text size="sm" c="dimmed">
          Demo mode is enabled for scaffolding. Password is <b>changeme</b>.
        </Text>
        <Alert color="blue" variant="light">
          This is a starter authentication flow intended to be replaced by your API.
        </Alert>
        <form onSubmit={onSubmit}>
          <Stack>
            <TextInput
              label="Username"
              placeholder="alex"
              {...register('username', { required: 'Username is required' })}
              error={formState.errors.username?.message}
            />
            <PasswordInput
              label="Password"
              placeholder="changeme"
              {...register('password', { required: 'Password is required' })}
              error={formState.errors.password?.message}
            />
            <Controller
              control={control}
              name="role"
              rules={{ required: 'Role is required' }}
              render={({ field, fieldState }) => (
                <Select
                  label="Role"
                  data={ROLE_OPTIONS}
                  value={field.value}
                  onChange={(value) => field.onChange((value ?? 'viewer') as Role)}
                  error={fieldState.error?.message}
                />
              )}
            />
            {formState.errors.root && (
              <Alert color="red">{formState.errors.root.message}</Alert>
            )}
            <Button type="submit" loading={formState.isSubmitting}>
              Sign in
            </Button>
          </Stack>
        </form>
        <Text size="sm" c="dimmed">
          Need a backend? Connect the shared API client and update the auth context
          implementation.
        </Text>
        <Anchor size="sm" href="/components">
          Preview the component showcase
        </Anchor>
      </Stack>
    </Paper>
  )
}
