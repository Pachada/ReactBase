import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DateInput } from '@mantine/dates'
import 'dayjs/locale/en'
import { Pencil, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/core/auth/AuthContext'
import type { ApiRole, ApiUser, UpdateUserRequest } from '@/core/api/types'
import { usersApi } from '@/features/admin/users-api'

interface EditUserForm {
  username: string
  email: string
  first_name: string
  last_name: string
  birthday: Date | null
  role_id: number
}

interface UsersTabProps {
  roles: ApiRole[]
}

/** Parse a YYYY-MM-DD birthday string as a local date (no UTC shift) */
function parseBirthday(raw: string | null | undefined): Date | null {
  if (!raw) return null
  const [y, m, d] = raw.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

/** Format a Date as YYYY-MM-DD in local time */
function formatYMD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function UsersTab({ roles }: UsersTabProps) {
  const auth = useAuth()
  const token = auth.token ?? ''
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<ApiUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ApiUser | null>(null)
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => usersApi.listUsers({ page, perPage: 20 }, token),
    enabled: !!token,
  })

  const users: ApiUser[] = data?.data ?? []
  const totalPages = data?.max_page ?? 1

  const { register, control, handleSubmit, formState, reset } = useForm<EditUserForm>()

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateUserRequest }) =>
      usersApi.updateUser(id, body, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      closeEdit()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersApi.deleteUser(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      closeDelete()
    },
  })

  const toggleEnableMutation = useMutation({
    mutationFn: ({ id, enable }: { id: number; enable: boolean }) =>
      usersApi.updateUser(id, { enable }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      closeDelete()
    },
  })

  function handleEdit(user: ApiUser) {
    setEditTarget(user)
    openEdit()
  }

  useEffect(() => {
    if (editOpened && editTarget) {
      reset({
        username: editTarget.username,
        email: editTarget.email,
        first_name: editTarget.first_name ?? '',
        last_name: editTarget.last_name ?? '',
        birthday: parseBirthday(editTarget.birthday),
        role_id: editTarget.role_id,
      })
    }
  }, [editOpened, editTarget, reset])

  function handleDelete(user: ApiUser) {
    setDeleteTarget(user)
    openDelete()
  }

  const onEditSubmit = handleSubmit((values) => {
    if (!editTarget) return
    const body: UpdateUserRequest = {}
    if (values.username !== editTarget.username) body.username = values.username
    if (values.email !== editTarget.email) body.email = values.email
    if (values.first_name !== (editTarget.first_name ?? ''))
      body.first_name = values.first_name
    if (values.last_name !== (editTarget.last_name ?? ''))
      body.last_name = values.last_name
    if (values.role_id !== editTarget.role_id) body.role_id = values.role_id

    const originalBirthday = parseBirthday(editTarget.birthday)
    const newBirthday = values.birthday ? new Date(values.birthday) : null
    if ((originalBirthday?.getTime() ?? null) !== (newBirthday?.getTime() ?? null)) {
      body.birthday = newBirthday ? formatYMD(newBirthday) : undefined
    }

    if (Object.keys(body).length === 0) {
      closeEdit()
      return
    }
    updateMutation.mutate({ id: editTarget.id, body })
  })

  const roleOptions = roles.map((r) => ({ value: String(r.id), label: r.name }))

  return (
    <>
      <Stack>
        {isLoading ? (
          <Loader mx="auto" my="xl" />
        ) : (
          <>
            <Table highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Username</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Enabled</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {users.map((u) => (
                  <Table.Tr key={u.id}>
                    <Table.Td>{u.username}</Table.Td>
                    <Table.Td>
                      {[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}
                    </Table.Td>
                    <Table.Td>{u.email}</Table.Td>
                    <Table.Td>
                      <Badge variant="light">
                        {roles.find((r) => r.id === u.role_id)?.name ?? u.role_id}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={u.enable ? 'green' : 'red'} variant="dot">
                        {u.enable ? 'Active' : 'Disabled'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon variant="subtle" onClick={() => handleEdit(u)}>
                          <Pencil size={14} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(u)}
                        >
                          <Trash2 size={14} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
                {users.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={6}>
                      <Text ta="center" c="dimmed" py="md">
                        No users found
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
            <Pagination value={page} onChange={setPage} total={totalPages} size="sm" />
          </>
        )}
      </Stack>

      {/* Edit modal */}
      <Modal opened={editOpened} onClose={closeEdit} title="Edit user" size="md">
        <form onSubmit={onEditSubmit}>
          <Stack>
            <TextInput
              label="Username"
              {...register('username', { required: true })}
              error={formState.errors.username?.message}
            />
            <TextInput
              label="Email"
              type="email"
              {...register('email', { required: true })}
              error={formState.errors.email?.message}
            />
            <Group grow>
              <TextInput label="First name" {...register('first_name')} />
              <TextInput label="Last name" {...register('last_name')} />
            </Group>
            <Controller
              control={control}
              name="birthday"
              render={({ field }) => (
                <DateInput
                  label="Birthday"
                  valueFormat="MM/DD/YYYY"
                  value={field.value}
                  onChange={field.onChange}
                  clearable
                  popoverProps={{ withinPortal: true, zIndex: 400 }}
                />
              )}
            />
            <Controller
              control={control}
              name="role_id"
              render={({ field }) => (
                <Select
                  label="Role"
                  data={roleOptions}
                  value={String(field.value)}
                  onChange={(v) => field.onChange(Number(v))}
                />
              )}
            />
            <Button type="submit" loading={updateMutation.isPending}>
              Save changes
            </Button>
          </Stack>
        </form>
      </Modal>

      {/* Delete / toggle-enable modal */}
      <Modal opened={deleteOpened} onClose={closeDelete} title="Manage user" size="sm">
        <Stack>
          <Text>
            {deleteTarget?.enable ? (
              <>
                Disable <b>{deleteTarget.username}</b>? They won&apos;t be able to log in
                but their data is kept.
              </>
            ) : (
              <>
                Re-enable <b>{deleteTarget?.username}</b>?
              </>
            )}
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDelete}>
              Cancel
            </Button>
            <Button
              color={deleteTarget?.enable ? 'orange' : 'green'}
              loading={toggleEnableMutation.isPending}
              onClick={() =>
                deleteTarget &&
                toggleEnableMutation.mutate({
                  id: deleteTarget.id,
                  enable: !deleteTarget.enable,
                })
              }
            >
              {deleteTarget?.enable ? 'Disable' : 'Re-enable'}
            </Button>
            <Button
              color="red"
              loading={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
