import {
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { Check, KeyRound, Pencil, ShieldAlert, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/core/auth/AuthContext'
import type { UpdateUserRequest } from '@/core/api/types'
import { usersApi } from '@/features/admin/users-api'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'
import {
  DATE_FORMAT,
  formatBirthdayDisplay,
  formatYMD,
  handleDateKeyDown,
  parseBirthday,
} from '@/core/utils/date'
import { ChangePasswordModal } from './ChangePasswordModal'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileForm {
  first_name: string
  last_name: string
  username: string
  birthday: Date | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return '?'
  const initials = trimmed
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2)
  return initials || '?'
}

// ─── Read-only info row ───────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <Box>
      <Text
        size="xs"
        fw={500}
        style={{
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--mantine-color-dimmed)',
          marginBottom: 2,
        }}
      >
        {label}
      </Text>
      <Text size="sm" fw={500} c={value ? undefined : 'dimmed'}>
        {value || '—'}
      </Text>
    </Box>
  )
}

// ─── Profile section ─────────────────────────────────────────────────────────

export function ProfileSection() {
  const auth = useAuth()
  const token = auth.token ?? ''
  const userId = auth.user?.id ?? ''
  const { addNotification } = useNotificationCenter()
  const [isEditing, setIsEditing] = useState(false)
  const [pwModalOpened, { open: openPwModal, close: closePwModal }] = useDisclosure(false)

  const userData = auth.user

  const { register, control, handleSubmit, formState, reset } = useForm<ProfileForm>({
    defaultValues: { first_name: '', last_name: '', username: '', birthday: null },
  })

  useEffect(() => {
    if (!userData) return
    reset({
      first_name: userData.first_name ?? '',
      last_name: userData.last_name ?? '',
      username: userData.username ?? '',
      birthday: parseBirthday(userData.birthday),
    })
  }, [userData, reset])

  const updateMutation = useMutation({
    mutationFn: (body: UpdateUserRequest) =>
      usersApi.updateUser(userId, body, token, auth.hasRole(['admin'])),
    onSuccess: () => {
      void auth.refreshUser(token)
      setIsEditing(false)
      addNotification({
        title: 'Profile updated',
        message: 'Your changes have been saved.',
        color: 'green',
      })
    },
    onError: () => {
      addNotification({
        title: 'Update failed',
        message: 'Could not save changes. Please try again.',
        color: 'red',
      })
    },
  })

  const onSubmit = (values: ProfileForm) => {
    if (!userData) return
    const body: UpdateUserRequest = {}
    if (values.first_name !== userData.first_name) body.first_name = values.first_name
    if (values.last_name !== userData.last_name) body.last_name = values.last_name
    if (values.username !== userData.username) body.username = values.username
    const originalBirthday = userData.birthday ?? null
    const newBirthday = values.birthday instanceof Date ? values.birthday : null
    if (newBirthday) {
      const formatted = formatYMD(newBirthday)
      if (formatted !== originalBirthday) body.birthday = formatted
    } else if (originalBirthday) {
      body.birthday = undefined
    }
    if (Object.keys(body).length === 0) {
      addNotification({ title: 'No changes', message: 'Nothing to save.', color: 'blue' })
      setIsEditing(false)
      return
    }
    updateMutation.mutate(body)
  }

  const handleCancel = () => {
    if (userData) {
      reset({
        first_name: userData.first_name ?? '',
        last_name: userData.last_name ?? '',
        username: userData.username ?? '',
        birthday: parseBirthday(userData.birthday),
      })
    }
    setIsEditing(false)
  }

  const displayName = auth.user?.name ?? auth.user?.username ?? 'User'
  const initials = getInitials(displayName)
  const roleName = auth.user?.roleName ?? ''

  return (
    <Stack gap="lg">
      {/* ── Hero card ─────────────────────────────────────────────────── */}
      <Paper withBorder radius="md" style={{ overflow: 'hidden', position: 'relative' }}>
        {/* Solid primary background */}
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--mantine-primary-color-filled)',
          }}
        />
        {/* Dark gradient overlay for readability */}
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(120deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 100%)',
          }}
        />
        {/* Decorative circles */}
        <Box
          style={{
            position: 'absolute',
            right: -32,
            top: -32,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            pointerEvents: 'none',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            right: 60,
            top: 20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          }}
        />
        {/* Large watermark initials */}
        <Box
          aria-hidden
          style={{
            position: 'absolute',
            right: 24,
            bottom: -16,
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1,
            color: 'rgba(255,255,255,0.06)',
            userSelect: 'none',
            pointerEvents: 'none',
            letterSpacing: '-0.04em',
          }}
        >
          {initials}
        </Box>
        {/* Content */}
        <Group
          px="xl"
          py="lg"
          gap="md"
          wrap="nowrap"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Avatar
            size={72}
            radius="xl"
            aria-label={`${displayName} avatar`}
            style={{
              border: '3px solid rgba(255,255,255,0.6)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              flexShrink: 0,
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 24,
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Text
              fw={800}
              size="xl"
              lh={1.2}
              style={{ color: '#fff', letterSpacing: '-0.01em' }}
            >
              {displayName}
            </Text>
            <Group gap="xs" mt={4} align="center">
              <Text size="sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                @{auth.user?.username}
              </Text>
              {roleName && (
                <Box
                  component="span"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 999,
                    padding: '1px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#fff',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {roleName}
                </Box>
              )}
            </Group>
          </Box>
        </Group>
      </Paper>

      {/* ── Personal information ───────────────────────────────────────── */}
      <Paper withBorder radius="md" p="lg">
        <Group justify="space-between" mb="lg">
          <Title order={5}>Personal information</Title>
          {!isEditing && (
            <Button
              variant="light"
              size="xs"
              leftSection={<Pencil size={13} />}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </Group>

        {!userData ? (
          <Group justify="center" py="xl">
            <Loader size="sm" />
          </Group>
        ) : isEditing ? (
          /* ── Edit mode ── */
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="First name"
                  {...register('first_name', { required: 'Required' })}
                  error={formState.errors.first_name?.message}
                />
                <TextInput
                  label="Last name"
                  {...register('last_name', { required: 'Required' })}
                  error={formState.errors.last_name?.message}
                />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="Username"
                  {...register('username', { required: 'Required' })}
                  error={formState.errors.username?.message}
                />
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      label="Birthday"
                      placeholder={DATE_FORMAT}
                      valueFormat={DATE_FORMAT}
                      value={field.value}
                      onChange={field.onChange}
                      maxDate={new Date()}
                      clearable
                      onKeyDown={handleDateKeyDown}
                    />
                  )}
                />
              </SimpleGrid>
              {/* Email & phone: read-only even in edit mode */}
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Text
                    size="xs"
                    fw={500}
                    mb={4}
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--mantine-color-dimmed)',
                    }}
                  >
                    Email
                  </Text>
                  <Text size="sm" fw={500}>
                    {userData?.email || '—'}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    Contact support to change your email
                  </Text>
                </Box>
                <Box>
                  <Text
                    size="xs"
                    fw={500}
                    mb={4}
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--mantine-color-dimmed)',
                    }}
                  >
                    Phone
                  </Text>
                  <Text size="sm" fw={500}>
                    {userData?.phone || '—'}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    Contact support to change your phone
                  </Text>
                </Box>
              </SimpleGrid>
              <Group justify="flex-end" gap="sm" mt="xs">
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<X size={14} />}
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={updateMutation.isPending}
                  leftSection={<Check size={14} />}
                >
                  Save changes
                </Button>
              </Group>
            </Stack>
          </form>
        ) : (
          /* ── View mode — clean data rows ── */
          <Stack gap={0}>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="lg">
              <InfoRow label="First name" value={userData?.first_name} />
              <InfoRow label="Last name" value={userData?.last_name} />
            </SimpleGrid>
            <Divider mb="lg" />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="lg">
              <InfoRow label="Username" value={userData?.username} />
              <InfoRow
                label="Birthday"
                value={formatBirthdayDisplay(userData?.birthday)}
              />
            </SimpleGrid>
            <Divider mb="lg" />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <InfoRow label="Email" value={userData?.email} />
              <InfoRow label="Phone" value={userData?.phone ?? undefined} />
            </SimpleGrid>
          </Stack>
        )}
      </Paper>

      {/* ── Security ───────────────────────────────────────────────────── */}
      <Paper withBorder radius="md" p="lg">
        <Group justify="space-between">
          <Box>
            <Group gap="xs" mb={4}>
              <ShieldAlert
                size={16}
                style={{ color: 'var(--mantine-primary-color-filled)' }}
              />
              <Title order={5}>Security</Title>
            </Group>
            <Text size="sm" c="dimmed">
              Manage your password and account security.
            </Text>
          </Box>
          <Button
            variant="light"
            leftSection={<KeyRound size={14} />}
            onClick={openPwModal}
          >
            Change password
          </Button>
        </Group>
      </Paper>

      {/* ── Change password modal ──────────────────────────────────────── */}
      <ChangePasswordModal opened={pwModalOpened} onClose={closePwModal} />
    </Stack>
  )
}
