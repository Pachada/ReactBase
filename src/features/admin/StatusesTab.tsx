import {
  ActionIcon,
  Button,
  Group,
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/core/auth/AuthContext'
import type { ApiStatus, StatusInput } from '@/core/api/types'
import { statusesApi } from '@/features/admin/statuses-api'

interface StatusForm {
  description: string
}

export function StatusesTab({ statuses }: { statuses: ApiStatus[] }) {
  const auth = useAuth()
  const token = auth.token ?? ''
  const queryClient = useQueryClient()
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  const [editTarget, setEditTarget] = useState<ApiStatus | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ApiStatus | null>(null)

  const { register, handleSubmit, formState, reset } = useForm<StatusForm>({
    defaultValues: { description: '' },
  })

  const createMutation = useMutation({
    mutationFn: (body: StatusInput) => statusesApi.createStatus(body, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: StatusInput }) =>
      statusesApi.updateStatus(id, body, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => statusesApi.deleteStatus(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
      closeDelete()
    },
  })

  function handleCreate() {
    setEditTarget(null)
    reset({ description: '' })
    openForm()
  }

  function handleEdit(status: ApiStatus) {
    setEditTarget(status)
    reset({ description: status.description })
    openForm()
  }

  function handleDelete(status: ApiStatus) {
    setDeleteTarget(status)
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
            Add status
          </Button>
        </Group>

        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {statuses.map((s) => (
              <Table.Tr key={s.id}>
                <Table.Td>{s.id}</Table.Td>
                <Table.Td>{s.description}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="subtle" onClick={() => handleEdit(s)}>
                      <Pencil size={14} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDelete(s)}
                    >
                      <Trash2 size={14} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {statuses.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text ta="center" c="dimmed" py="md">
                    No statuses found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Stack>

      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={editTarget ? 'Edit status' : 'Create status'}
        size="sm"
      >
        <form onSubmit={onSubmit}>
          <Stack>
            <TextInput
              label="Description"
              placeholder="Active"
              {...register('description', { required: 'Description is required' })}
              error={formState.errors.description?.message}
            />
            <Button type="submit" loading={isSubmitting}>
              {editTarget ? 'Save changes' : 'Create status'}
            </Button>
          </Stack>
        </form>
      </Modal>

      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete status" size="sm">
        <Stack>
          <Text>
            Are you sure you want to delete status <b>{deleteTarget?.description}</b>?
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
