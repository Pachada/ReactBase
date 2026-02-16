import {
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { BarChart, LineChart } from '@mantine/charts'
import { useState } from 'react'

const releaseData = [
  { month: 'Jan', frontend: 18, backend: 12 },
  { month: 'Feb', frontend: 24, backend: 16 },
  { month: 'Mar', frontend: 29, backend: 22 },
  { month: 'Apr', frontend: 32, backend: 26 },
  { month: 'May', frontend: 38, backend: 30 },
]

const deployRows = [
  { env: 'Development', status: 'Healthy', latencyMs: 104 },
  { env: 'Staging', status: 'Healthy', latencyMs: 126 },
  { env: 'Production', status: 'Monitoring', latencyMs: 171 },
]

export function ComponentsPage() {
  const [enabled, setEnabled] = useState(true)

  return (
    <Stack>
      <Title order={2}>Mantine component showcase</Title>
      <Text c="dimmed">
        A reference page for common controls, states, and composition patterns.
      </Text>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Card withBorder radius="md">
          <Stack>
            <Group justify="space-between">
              <Text fw={600}>Buttons and badges</Text>
              <Badge color="teal">Ready</Badge>
            </Group>
            <Group>
              <Button>Primary</Button>
              <Button variant="default">Secondary</Button>
              <Button variant="light" color="green">
                Success
              </Button>
            </Group>
          </Stack>
        </Card>
        <Card withBorder radius="md">
          <Stack>
            <Text fw={600}>Inputs</Text>
            <TextInput label="Project name" placeholder="ReactBase" />
            <Select
              label="Environment"
              defaultValue="dev"
              data={[
                { value: 'dev', label: 'Development' },
                { value: 'staging', label: 'Staging' },
                { value: 'prod', label: 'Production' },
              ]}
            />
          </Stack>
        </Card>
      </SimpleGrid>
      <Card withBorder radius="md">
        <Tabs defaultValue="status">
          <Tabs.List>
            <Tabs.Tab value="status">Status</Tabs.Tab>
            <Tabs.Tab value="toggles">Toggles</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="status" pt="md">
            <Stack>
              <Text size="sm">Release progress</Text>
              <Progress value={72} />
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="toggles" pt="md">
            <Stack>
              <Switch
                checked={enabled}
                onChange={(event) => setEnabled(event.currentTarget.checked)}
                label="Feature flag enabled"
              />
              <Checkbox defaultChecked label="Require MFA for admin users" />
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Card>
      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <Card withBorder radius="md">
          <Stack>
            <Text fw={600}>Environment table</Text>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Environment</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Latency (ms)</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {deployRows.map((row) => (
                  <Table.Tr key={row.env}>
                    <Table.Td>{row.env}</Table.Td>
                    <Table.Td>{row.status}</Table.Td>
                    <Table.Td>{row.latencyMs}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </Card>
        <Card withBorder radius="md">
          <Tabs defaultValue="line">
            <Tabs.List>
              <Tabs.Tab value="line">Line chart</Tabs.Tab>
              <Tabs.Tab value="bar">Bar chart</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="line" pt="md">
              <LineChart
                h={220}
                data={releaseData}
                dataKey="month"
                series={[
                  { name: 'frontend', color: 'indigo.6' },
                  { name: 'backend', color: 'teal.6' },
                ]}
                withLegend
                curveType="natural"
              />
            </Tabs.Panel>
            <Tabs.Panel value="bar" pt="md">
              <BarChart
                h={220}
                data={releaseData}
                dataKey="month"
                series={[
                  { name: 'frontend', color: 'indigo.6' },
                  { name: 'backend', color: 'teal.6' },
                ]}
                withLegend
              />
            </Tabs.Panel>
          </Tabs>
        </Card>
      </SimpleGrid>
    </Stack>
  )
}
