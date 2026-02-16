import { Button, Card, Group, Select, Stack, TextInput, Title } from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import { ROLE_OPTIONS } from '@/core/auth/roles'
import type { Role } from '@/core/auth/types'

interface ProfileFormValues {
  fullName: string
  email: string
  role: Role
}

export function ProfileFormCard() {
  const { register, control, handleSubmit, formState } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      role: 'viewer',
    },
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(() => {
    // skeleton extension point for real mutation calls
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
            <Button type="submit">Save profile</Button>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}
