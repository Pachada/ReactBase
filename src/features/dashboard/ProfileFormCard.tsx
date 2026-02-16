import {
  Alert,
  Button,
  Card,
  Group,
  Select,
  Skeleton,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'
import { ROLE_OPTIONS } from '@/core/auth/roles'
import { ErrorStateAlert } from '@/core/ui/ErrorStateAlert'
import type { Role } from '@/core/auth/types'

interface ProfileFormValues {
  fullName: string
  email: string
  role: Role
}

export function ProfileFormCard() {
  const { addNotification } = useNotificationCenter()
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'success' | 'error'>(
    'idle',
  )
  const { register, control, handleSubmit, formState } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      role: 'viewer',
    },
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(async () => {
    setSaveState('saving')
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSaveState('success')
      addNotification({
        title: 'Profile saved',
        message: 'Profile changes were saved locally.',
        color: 'green',
      })
    } catch {
      setSaveState('error')
    }
  })

  return (
    <Card withBorder shadow="xs" radius="md">
      <form onSubmit={onSubmit}>
        <Stack>
          <Title order={4}>Form foundation</Title>
          <TextInput
            label="Full name"
            placeholder="Jane Doe"
            {...register('fullName', { required: 'Full name is required' })}
            error={formState.errors.fullName?.message}
          />
          <TextInput
            label="Email"
            placeholder="jane@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email',
              },
            })}
            error={formState.errors.email?.message}
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
          <Group justify="flex-end">
            <Button type="submit" loading={saveState === 'saving'}>
              Save profile
            </Button>
          </Group>
          {saveState === 'saving' && <Skeleton h={52} radius="md" />}
          {saveState === 'success' && (
            <Alert color="green" variant="light">
              Changes saved. You can keep editing while data sync completes.
            </Alert>
          )}
          {saveState === 'error' && (
            <ErrorStateAlert
              title="Profile update failed"
              message="We could not save your profile right now."
              actionLabel="Retry"
              onAction={() => {
                setSaveState('idle')
              }}
            />
          )}
        </Stack>
      </form>
    </Card>
  )
}
