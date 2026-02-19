import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/core/auth/AuthContext'
import type { ApiRole, EntityId, RoleInput } from '@/core/api/types'
import { rolesApi } from '@/features/admin/roles-api'

interface RoleForm {
  name: string
}

export function RolesTab() {
  const auth = useAuth()
  const token = auth.token ?? ''
  const queryClient = useQueryClient()
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  const [editTarget, setEditTarget] = useState<ApiRole | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ApiRole | null>(null)

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesApi.listRoles(token),
    enabled: !!token,
  })

  const { register, handleSubmit, formState, reset } = useForm<RoleForm>({
    defaultValues: { name: '' },
  })

  const createMutation = useMutation({
    mutationFn: (body: RoleInput) => rolesApi.createRole(body, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: EntityId; body: RoleInput }) =>
      rolesApi.updateRole(id, body, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: EntityId) => rolesApi.deleteRole(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      closeDelete()
    },
  })

  const toggleEnableMutation = useMutation({
    mutationFn: ({ id, name, enable }: { id: EntityId; name: string; enable: boolean }) =>
      rolesApi.updateRole(id, { name, enable }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      closeDelete()
    },
  })

  function handleCreate() {
    setEditTarget(null)
    reset({ name: '' })
    openForm()
  }

  function handleEdit(role: ApiRole) {
    setEditTarget(role)
    reset({ name: role.name })
    openForm()
  }

  function handleDelete(role: ApiRole) {
    setDeleteTarget(role)
    openDelete()
  }

  const onSubmit = handleSubmit((values) => {
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, body: values })
    } else {
      createMutation.mutate(values)
    }
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <>
      <Stack>
        <Group justify="flex-end">
          <Button leftSection={<Plus size={14} />} size="sm" onClick={handleCreate}>
            Add role
          </Button>
        </Group>

        {isLoading ? (
          <Loader mx="auto" my="xl" />
        ) : (
          <Table highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {roles.map((r) => (
                <Table.Tr key={r.id}>
                  <Table.Td>{r.id}</Table.Td>
                  <Table.Td>{r.name}</Table.Td>
                  <Table.Td>
                    <Badge color={r.enable ? 'green' : 'gray'} variant="dot">
                      {r.enable ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => handleEdit(r)}>
                        <Pencil size={14} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(r)}
                      >
                        <Trash2 size={14} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
              {roles.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" c="dimmed" py="md">
                      No roles found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        )}
      </Stack>

      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={editTarget ? 'Edit role' : 'Create role'}
        size="sm"
      >
        <form onSubmit={onSubmit}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="admin"
              {...register('name', { required: 'Name is required' })}
              error={formState.errors.name?.message}
            />
            <Button type="submit" loading={isSubmitting}>
              {editTarget ? 'Save changes' : 'Create role'}
            </Button>
          </Stack>
        </form>
      </Modal>

      <Modal opened={deleteOpened} onClose={closeDelete} title="Manage role" size="sm">
        <Stack>
          <Text>
            {deleteTarget?.enable ? (
              <>
                Disable role <b>{deleteTarget.name}</b>?
              </>
            ) : (
              <>
                Re-enable role <b>{deleteTarget?.name}</b>?
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
                  name: deleteTarget.name,
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
