import { Button, Group, Modal, PasswordInput, Stack, Text } from '@mantine/core'
import { Check, KeyRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/core/auth/AuthContext'
import { sessionApi } from '@/core/api/session-api'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'

interface ChangePasswordForm {
  new_password: string
  confirm_password: string
}

interface ChangePasswordModalProps {
  opened: boolean
  onClose: () => void
}

export function ChangePasswordModal({ opened, onClose }: ChangePasswordModalProps) {
  const auth = useAuth()
  const token = auth.token ?? ''
  const { addNotification } = useNotificationCenter()

  const { register, handleSubmit, formState, reset, getValues, trigger } =
    useForm<ChangePasswordForm>({
      defaultValues: { new_password: '', confirm_password: '' },
    })

  const handleClose = () => {
    onClose()
    reset()
  }

  const changePasswordMutation = useMutation({
    mutationFn: (body: { new_password: string }) =>
      sessionApi.changePassword(body, token),
    onSuccess: () => {
      handleClose()
      addNotification({
        title: 'Password changed',
        message: 'Your password has been updated.',
        color: 'green',
      })
    },
    onError: () => {
      addNotification({
        title: 'Password change failed',
        message: 'Could not update password. Please try again.',
        color: 'red',
      })
    },
  })

  const onChangePassword = (values: ChangePasswordForm) => {
    changePasswordMutation.mutate({ new_password: values.new_password })
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <KeyRound size={16} />
          <Text fw={600}>Change password</Text>
        </Group>
      }
      centered
      size="sm"
    >
      <form onSubmit={handleSubmit(onChangePassword)}>
        <Stack gap="md">
          <PasswordInput
            label="New password"
            placeholder="At least 8 characters"
            {...register('new_password', {
              required: 'Required',
              minLength: { value: 8, message: 'At least 8 characters' },
              onChange: () => {
                if (formState.dirtyFields.confirm_password) trigger('confirm_password')
              },
            })}
            error={formState.errors.new_password?.message}
          />
          <PasswordInput
            label="Confirm new password"
            placeholder="Repeat new password"
            {...register('confirm_password', {
              required: 'Required',
              validate: (v) =>
                v === getValues('new_password') || 'Passwords do not match',
            })}
            error={formState.errors.confirm_password?.message}
          />
          <Group justify="flex-end" gap="sm" mt="xs">
            <Button
              variant="subtle"
              color="gray"
              onClick={handleClose}
              disabled={changePasswordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={changePasswordMutation.isPending}
              leftSection={<Check size={14} />}
            >
              Update password
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
