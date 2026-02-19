import {
  Avatar,
  Box,
  Button,
  ColorSwatch,
  Divider,
  Group,
  Loader,
  Modal,
  Paper,
  PasswordInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import {
  Check,
  KeyRound,
  Monitor,
  Moon,
  Palette,
  Pencil,
  RotateCcw,
  ShieldAlert,
  Sun,
  User,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/core/auth/AuthContext'
import type { UpdateUserRequest } from '@/core/api/types'
import { usersApi } from '@/features/admin/users-api'
import { sessionApi } from '@/core/api/session-api'
import { usePrimaryColorSettings } from '@/core/theme/PrimaryColorContext'
import { PRIMARY_COLOR_PRESETS } from '@/core/theme/color-presets'
import { useThemeTokens } from '@/core/theme/ThemeTokensContext'
import { FontPicker } from '@/core/ui/FontPicker'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'
import {
  DATE_FORMAT,
  formatBirthdayDisplay,
  formatYMD,
  handleDateKeyDown,
  parseBirthday,
} from '@/core/utils/date'

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = 'profile' | 'appearance'

interface ProfileForm {
  first_name: string
  last_name: string
  username: string
  birthday: Date | null
}

interface ChangePasswordForm {
  new_password: string
  confirm_password: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
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

// ─── Section nav ──────────────────────────────────────────────────────────────

const SECTIONS: Array<{ id: Section; label: string; icon: typeof User }> = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

function SectionNavItem({
  section,
  active,
  onClick,
}: {
  section: (typeof SECTIONS)[number]
  active: boolean
  onClick: () => void
}) {
  const Icon = section.icon
  return (
    <UnstyledButton
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 'var(--mantine-radius-md)',
        background: active ? 'var(--mantine-primary-color-light)' : 'transparent',
        color: active
          ? 'var(--mantine-primary-color-filled)'
          : 'var(--mantine-color-text)',
        fontWeight: active ? 600 : 400,
        width: '100%',
        transition: 'background 0.15s ease, color 0.15s ease',
        fontSize: 'var(--mantine-font-size-sm)',
        opacity: active ? 1 : 0.75,
      }}
    >
      <Icon size={15} />
      {section.label}
    </UnstyledButton>
  )
}

// ─── Profile section ─────────────────────────────────────────────────────────

function ProfileSection() {
  const auth = useAuth()
  const token = auth.token ?? ''
  const userId = auth.user?.id ?? ''
  const { addNotification } = useNotificationCenter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [pwModalOpened, { open: openPwModal, close: closePwModal }] = useDisclosure(false)

  const { data: sessionData, isLoading } = useQuery({
    queryKey: ['currentSession'],
    queryFn: () => sessionApi.getSession(token),
    enabled: !!token,
  })

  const userData = sessionData?.user

  // Profile edit form (only editable fields)
  const { register, control, handleSubmit, formState, reset } = useForm<ProfileForm>({
    defaultValues: { first_name: '', last_name: '', username: '', birthday: null },
  })

  // Change password form
  const {
    register: regPw,
    handleSubmit: handlePwSubmit,
    formState: pwFormState,
    reset: resetPw,
    getValues: getPwValues,
  } = useForm<ChangePasswordForm>({
    defaultValues: { new_password: '', confirm_password: '' },
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
    mutationFn: (body: UpdateUserRequest) => usersApi.updateUser(userId, body, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSession'] })
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

  const changePasswordMutation = useMutation({
    mutationFn: (body: { new_password: string }) =>
      sessionApi.changePassword(body, token),
    onSuccess: () => {
      closePwModal()
      resetPw()
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

  const onSubmit = (values: ProfileForm) => {
    if (!userData) return
    const body: UpdateUserRequest = {}
    if (values.first_name !== userData.first_name) body.first_name = values.first_name
    if (values.last_name !== userData.last_name) body.last_name = values.last_name
    if (values.username !== userData.username) body.username = values.username
    if (values.birthday) {
      const raw =
        values.birthday instanceof Date
          ? values.birthday
          : parseBirthday(values.birthday as unknown as string)
      const formatted = raw ? formatYMD(raw) : null
      if (formatted && formatted !== userData.birthday) body.birthday = formatted
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

  const onChangePassword = (values: ChangePasswordForm) => {
    changePasswordMutation.mutate({ new_password: values.new_password })
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

        {isLoading ? (
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
      <Modal
        opened={pwModalOpened}
        onClose={() => {
          closePwModal()
          resetPw()
        }}
        title={
          <Group gap="xs">
            <KeyRound size={16} />
            <Text fw={600}>Change password</Text>
          </Group>
        }
        centered
        size="sm"
      >
        <form onSubmit={handlePwSubmit(onChangePassword)}>
          <Stack gap="md">
            <PasswordInput
              label="New password"
              placeholder="At least 8 characters"
              {...regPw('new_password', {
                required: 'Required',
                minLength: { value: 8, message: 'At least 8 characters' },
              })}
              error={pwFormState.errors.new_password?.message}
            />
            <PasswordInput
              label="Confirm new password"
              placeholder="Repeat new password"
              {...regPw('confirm_password', {
                required: 'Required',
                validate: (v) =>
                  v === getPwValues('new_password') || 'Passwords do not match',
              })}
              error={pwFormState.errors.confirm_password?.message}
            />
            <Group justify="flex-end" gap="sm" mt="xs">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  closePwModal()
                  resetPw()
                }}
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
    </Stack>
  )
}

// ─── Appearance section ───────────────────────────────────────────────────────

function AppearanceSection() {
  const { setColorScheme, colorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  })
  const { primaryColor, setPrimaryColor } = usePrimaryColorSettings()
  const { tokens, updateTokens, resetTokens } = useThemeTokens()
  const { addNotification } = useNotificationCenter()

  // Reflect 'auto' vs explicit scheme
  const schemeValue = colorScheme === 'auto' ? 'auto' : computedColorScheme

  return (
    <Stack gap="lg">
      {/* Color scheme */}
      <Paper withBorder radius="md" p="lg">
        <Stack gap="md">
          <Box>
            <Title order={5} mb={4}>
              Color scheme
            </Title>
            <Text size="sm" c="dimmed">
              Choose between light, dark, or follow your system setting.
            </Text>
          </Box>
          <SegmentedControl
            value={schemeValue}
            onChange={(v) => setColorScheme(v as 'light' | 'dark' | 'auto')}
            style={{ alignSelf: 'flex-start' }}
            data={[
              {
                value: 'light',
                label: (
                  <Group gap={6} wrap="nowrap">
                    <Sun size={13} />
                    <span>Light</span>
                  </Group>
                ),
              },
              {
                value: 'dark',
                label: (
                  <Group gap={6} wrap="nowrap">
                    <Moon size={13} />
                    <span>Dark</span>
                  </Group>
                ),
              },
              {
                value: 'auto',
                label: (
                  <Group gap={6} wrap="nowrap">
                    <Monitor size={13} />
                    <span>System</span>
                  </Group>
                ),
              },
            ]}
          />
        </Stack>
      </Paper>

      {/* Accent color */}
      <Paper withBorder radius="md" p="lg">
        <Stack gap="md">
          <Box>
            <Title order={5} mb={4}>
              Accent color
            </Title>
            <Text size="sm" c="dimmed">
              Sets the primary color used across buttons, links, and highlights.
            </Text>
          </Box>
          <Group gap="sm" wrap="wrap">
            {PRIMARY_COLOR_PRESETS.map((preset) => (
              <Tooltip key={preset.value} label={preset.label} withArrow>
                <UnstyledButton
                  onClick={() => setPrimaryColor(preset.value)}
                  aria-label={`Select ${preset.label} color`}
                >
                  <ColorSwatch
                    color={preset.previewColor}
                    size={32}
                    style={{
                      cursor: 'pointer',
                      boxShadow:
                        primaryColor === preset.value
                          ? '0 0 0 2px var(--mantine-color-body), 0 0 0 4px var(--mantine-primary-color-filled)'
                          : undefined,
                      transition: 'box-shadow 0.15s ease',
                    }}
                  >
                    {primaryColor === preset.value && (
                      <Check
                        size={14}
                        style={{
                          color: '#fff',
                          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))',
                        }}
                      />
                    )}
                  </ColorSwatch>
                </UnstyledButton>
              </Tooltip>
            ))}
          </Group>
        </Stack>
      </Paper>

      {/* Typography & layout */}
      <Paper withBorder radius="md" p="lg">
        <Stack gap="md">
          <Box>
            <Title order={5} mb={4}>
              Typography &amp; layout
            </Title>
            <Text size="sm" c="dimmed">
              Customize fonts, radius, and notification placement.
            </Text>
          </Box>
          <FontPicker
            value={tokens.fontFamily}
            onChange={(value) => updateTokens({ fontFamily: value })}
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Select
              label="Border radius"
              value={tokens.radius}
              onChange={(value) =>
                updateTokens({
                  radius: (value as 'sm' | 'md' | 'lg' | 'xl') ?? tokens.radius,
                })
              }
              data={[
                { value: 'sm', label: 'Small' },
                { value: 'md', label: 'Medium' },
                { value: 'lg', label: 'Large' },
                { value: 'xl', label: 'Extra large' },
              ]}
            />
            <Select
              label="Notification position"
              value={tokens.notificationPosition}
              onChange={(value) =>
                updateTokens({
                  notificationPosition:
                    (value as 'top-right' | 'bottom-right' | 'bottom-center') ??
                    tokens.notificationPosition,
                })
              }
              data={[
                { value: 'top-right', label: 'Top right' },
                { value: 'bottom-right', label: 'Bottom right' },
                { value: 'bottom-center', label: 'Bottom center' },
              ]}
            />
          </SimpleGrid>
          <Divider />
          <Group>
            <Button
              variant="subtle"
              color="gray"
              leftSection={<RotateCcw size={13} />}
              size="sm"
              onClick={() => {
                resetTokens()
                addNotification({
                  title: 'Appearance reset',
                  message: 'All appearance settings have been reset to defaults.',
                  color: 'blue',
                })
              }}
            >
              Reset to defaults
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('profile')

  return (
    <Box>
      <Group
        align="flex-start"
        gap="xl"
        wrap="nowrap"
        style={{ alignItems: 'flex-start' }}
      >
        {/* Left nav — desktop only */}
        <Box
          visibleFrom="sm"
          style={{ width: 192, flexShrink: 0, position: 'sticky', top: 80 }}
        >
          <Stack gap={2}>
            {SECTIONS.map((section) => (
              <SectionNavItem
                key={section.id}
                section={section}
                active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              />
            ))}
          </Stack>
        </Box>

        {/* Content (flex: 1 to fill remaining space) */}
        <Box style={{ flex: 1, minWidth: 0 }}>
          {/* Mobile: horizontal tab bar above content */}
          <Box hiddenFrom="sm" mb="md">
            <SegmentedControl
              value={activeSection}
              onChange={(v) => setActiveSection(v as Section)}
              fullWidth
              data={SECTIONS.map((s) => ({ value: s.id, label: s.label }))}
            />
          </Box>

          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'appearance' && <AppearanceSection />}
        </Box>
      </Group>
    </Box>
  )
}
