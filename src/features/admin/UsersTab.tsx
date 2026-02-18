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
  Switch,
  Table,
  Text,
  TextInput,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DateInput } from '@mantine/dates'
import 'dayjs/locale/en'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
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
  enable: boolean
}

interface UsersTabProps {
  roles: ApiRole[]
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

  function handleEdit(user: ApiUser) {
    setEditTarget(user)
    reset({
      username: user.username,
      email: user.email,
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      birthday: user.birthday ? new Date(user.birthday) : null,
      role_id: user.role_id,
      enable: user.enable ?? true,
    })
    openEdit()
  }

  function handleDelete(user: ApiUser) {
    setDeleteTarget(user)
    openDelete()
  }

  const onEditSubmit = handleSubmit((values) => {
    if (!editTarget) return
    updateMutation.mutate({
      id: editTarget.id,
      body: {
        username: values.username,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        birthday: values.birthday?.toISOString(),
        role_id: values.role_id,
        enable: values.enable,
      },
    })
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
            <Controller
              control={control}
              name="enable"
              render={({ field }) => (
                <Switch
                  label="Enabled"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.currentTarget.checked)}
                />
              )}
            />
            <Button type="submit" loading={updateMutation.isPending}>
              Save changes
            </Button>
          </Stack>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete user" size="sm">
        <Stack>
          <Text>
            Are you sure you want to delete <b>{deleteTarget?.username}</b>? This action
            cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDelete}>
              Cancel
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
