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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from '@/core/auth/AuthContext'
import { buildRoleOptions } from '@/core/auth/roles'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'
import { ErrorStateAlert } from '@/core/ui/ErrorStateAlert'
import { rolesApi } from '@/features/admin/roles-api'
import {
  fetchProfile,
  updateProfile,
  type Profile,
} from '@/features/dashboard/profile-api'

const PROFILE_QUERY_KEY = ['profile']

export function ProfileFormCard() {
  const { addNotification } = useNotificationCenter()
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle')
  const { register, control, handleSubmit, formState, reset } = useForm<Profile>({
    defaultValues: {
      fullName: '',
      email: '',
      role: 'viewer',
    },
    mode: 'onBlur',
  })

  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesApi.listRoles(token ?? ''),
    enabled: !!token,
  })

  const roleOptions = buildRoleOptions(rolesQuery.data ?? [])

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
  })

  useEffect(() => {
    if (profileQuery.data) {
      reset(profileQuery.data)
    }
  }, [profileQuery.data, reset])

  const saveProfileMutation = useMutation({
    mutationFn: updateProfile,
    onMutate: async (nextProfile) => {
      setSaveState('idle')
      await queryClient.cancelQueries({ queryKey: PROFILE_QUERY_KEY })
      const previousProfile = queryClient.getQueryData<Profile>(PROFILE_QUERY_KEY)
      queryClient.setQueryData(PROFILE_QUERY_KEY, nextProfile)
      return { previousProfile }
    },
    onError: (error, _nextProfile, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(PROFILE_QUERY_KEY, context.previousProfile)
        reset(context.previousProfile)
      }
      setSaveState('error')
      addNotification({
        title: 'Profile update failed',
        message:
          error instanceof Error
            ? error.message
            : 'We could not save your profile right now.',
        color: 'red',
      })
    },
    onSuccess: (serverProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, serverProfile)
      reset(serverProfile)
      setSaveState('success')
      addNotification({
        title: 'Profile saved',
        message: 'Profile changes were synced successfully.',
        color: 'green',
      })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    },
  })

  const onSubmit = handleSubmit((values) => {
    saveProfileMutation.mutate(values)
  })

  if (profileQuery.isLoading) {
    return (
      <Card withBorder shadow="xs" radius="md">
        <Stack>
          <Skeleton h={18} w="35%" radius="sm" />
          <Skeleton h={74} radius="md" />
          <Skeleton h={74} radius="md" />
          <Skeleton h={74} radius="md" />
          <Group justify="flex-end">
            <Skeleton h={36} w={120} radius="xl" />
          </Group>
        </Stack>
      </Card>
    )
  }

  if (profileQuery.isError) {
    return (
      <Card withBorder shadow="xs" radius="md">
        <ErrorStateAlert
          title="Profile data unavailable"
          message="We could not load profile details."
          actionLabel="Retry"
          onAction={() => {
            void profileQuery.refetch()
          }}
        />
      </Card>
    )
  }

  if (rolesQuery.isError) {
    return (
      <Card withBorder shadow="xs" radius="md">
        <Stack>
          <Title order={4}>Form foundation</Title>
          <Alert color="red" title="Unable to load roles">
            We could not load the list of roles. Please refresh the page to try again.
          </Alert>
        </Stack>
      </Card>
    )
  }

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
            description='Tip: use an email containing "fail" to simulate rollback.'
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
                data={roleOptions}
                disabled={rolesQuery.isLoading}
                value={field.value}
                onChange={(value) =>
                  field.onChange((value ?? 'viewer') as Profile['role'])
                }
                error={fieldState.error?.message}
              />
            )}
          />
          <Group justify="flex-end">
            <Button type="submit" loading={saveProfileMutation.isPending}>
              Save profile
            </Button>
          </Group>
          {saveProfileMutation.isPending && <Skeleton h={52} radius="md" />}
          {saveState === 'success' && (
            <Alert color="green" variant="light">
              Changes saved. Optimistic UI applied instantly and verified with server
              sync.
            </Alert>
          )}
          {saveState === 'error' && (
            <ErrorStateAlert
              title="Profile update failed"
              message="Optimistic changes were rolled back to the last saved profile."
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
