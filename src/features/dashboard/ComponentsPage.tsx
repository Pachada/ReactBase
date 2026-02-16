import {
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  Pagination,
  Progress,
  ScrollArea,
  Select,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { AreaChart, BarChart, LineChart } from '@mantine/charts'
import { useMemo, useState } from 'react'

const releaseData = [
  { month: 'Jan', frontend: 18, backend: 12 },
  { month: 'Feb', frontend: 24, backend: 16 },
  { month: 'Mar', frontend: 29, backend: 22 },
  { month: 'Apr', frontend: 32, backend: 26 },
  { month: 'May', frontend: 38, backend: 30 },
]

const deployRows = [
  { id: 'dev-us', env: 'Development US', status: 'Healthy', latencyMs: 104 },
  { id: 'dev-eu', env: 'Development EU', status: 'Healthy', latencyMs: 111 },
  { id: 'stg-us', env: 'Staging US', status: 'Healthy', latencyMs: 126 },
  { id: 'stg-eu', env: 'Staging EU', status: 'Healthy', latencyMs: 138 },
  { id: 'prd-us', env: 'Production US', status: 'Monitoring', latencyMs: 171 },
  { id: 'prd-eu', env: 'Production EU', status: 'Monitoring', latencyMs: 182 },
  { id: 'prd-ap', env: 'Production APAC', status: 'Degraded', latencyMs: 241 },
]

const PAGE_SIZE = 4

export function ComponentsPage() {
  const [enabled, setEnabled] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'env' | 'latencyMs'>('env')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line')
  const [showLegend, setShowLegend] = useState(true)
  const [showBackendSeries, setShowBackendSeries] = useState(true)
  const [isChartLoading, setIsChartLoading] = useState(false)
  const [isChartEmpty, setIsChartEmpty] = useState(false)

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return deployRows
      .filter((row) =>
        statusFilter === 'all'
          ? true
          : row.status.toLowerCase() === statusFilter.toLowerCase(),
      )
      .filter((row) =>
        normalizedQuery.length === 0
          ? true
          : `${row.env} ${row.status}`.toLowerCase().includes(normalizedQuery),
      )
  }, [query, statusFilter])

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows]
    rows.sort((a, b) => {
      if (sortBy === 'latencyMs') {
        return sortDirection === 'asc'
          ? a.latencyMs - b.latencyMs
          : b.latencyMs - a.latencyMs
      }

      const result = a.env.localeCompare(b.env)
      return sortDirection === 'asc' ? result : -result
    })
    return rows
  }, [filteredRows, sortBy, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedRows = sortedRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )
  const pageRowIds = paginatedRows.map((row) => row.id)
  const selectedOnPageCount = pageRowIds.filter((id) =>
    selectedRowIds.includes(id),
  ).length
  const allPageRowsSelected =
    paginatedRows.length > 0 && selectedOnPageCount === paginatedRows.length
  const partiallySelected = selectedOnPageCount > 0 && !allPageRowsSelected

  const series = useMemo(
    () =>
      [
        { name: 'frontend', color: 'indigo.6' },
        ...(showBackendSeries ? [{ name: 'backend', color: 'teal.6' }] : []),
      ] as Array<{ name: 'frontend' | 'backend'; color: string }>,
    [showBackendSeries],
  )

  const chartData = isChartEmpty ? [] : releaseData
  const toggleSortDirection = () =>
    setSortDirection((value) => (value === 'asc' ? 'desc' : 'asc'))
  const togglePageSelection = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds((previous) =>
        Array.from(new Set([...previous, ...paginatedRows.map((row) => row.id)])),
      )
      return
    }

    setSelectedRowIds((previous) =>
      previous.filter((id) => !paginatedRows.some((row) => row.id === id)),
    )
  }

  const toggleRowSelection = (rowId: string, checked: boolean) =>
    setSelectedRowIds((previous) =>
      checked
        ? Array.from(new Set([...previous, rowId]))
        : previous.filter((id) => id !== rowId),
    )

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
            <Group justify="space-between">
              <Text fw={600}>Environment table</Text>
              <Badge variant="light">{selectedRowIds.length} selected</Badge>
            </Group>
            <Group grow>
              <TextInput
                aria-label="Filter environments"
                placeholder="Filter by environment or status"
                value={query}
                onChange={(event) => {
                  setQuery(event.currentTarget.value)
                  setPage(1)
                }}
              />
              <Select
                aria-label="Filter status"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value ?? 'all')
                  setPage(1)
                }}
                data={[
                  { value: 'all', label: 'All statuses' },
                  { value: 'healthy', label: 'Healthy' },
                  { value: 'monitoring', label: 'Monitoring' },
                  { value: 'degraded', label: 'Degraded' },
                ]}
              />
            </Group>
            <Group grow>
              <Select
                aria-label="Sort rows"
                value={sortBy}
                onChange={(value) => setSortBy((value as 'env' | 'latencyMs') ?? 'env')}
                data={[
                  { value: 'env', label: 'Sort by environment' },
                  { value: 'latencyMs', label: 'Sort by latency' },
                ]}
              />
              <Button variant="default" onClick={toggleSortDirection}>
                Direction: {sortDirection.toUpperCase()}
              </Button>
            </Group>
            <ScrollArea h={260}>
              <Table stickyHeader striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>
                      <Checkbox
                        aria-label="Select all rows on page"
                        checked={allPageRowsSelected}
                        indeterminate={partiallySelected}
                        onChange={(event) =>
                          togglePageSelection(event.currentTarget.checked)
                        }
                      />
                    </Table.Th>
                    <Table.Th>Environment</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th ta="right">Latency (ms)</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedRows.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={4}>
                        <Text size="sm" c="dimmed">
                          No rows match the selected filters.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    paginatedRows.map((row) => {
                      const isSelected = selectedRowIds.includes(row.id)
                      return (
                        <Table.Tr
                          key={row.id}
                          bg={isSelected ? 'var(--mantine-color-blue-light)' : undefined}
                        >
                          <Table.Td>
                            <Checkbox
                              aria-label={`Select ${row.env}`}
                              checked={isSelected}
                              onChange={(event) =>
                                toggleRowSelection(row.id, event.currentTarget.checked)
                              }
                            />
                          </Table.Td>
                          <Table.Td>{row.env}</Table.Td>
                          <Table.Td>{row.status}</Table.Td>
                          <Table.Td ta="right">{row.latencyMs}</Table.Td>
                        </Table.Tr>
                      )
                    })
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Showing {paginatedRows.length} of {sortedRows.length} rows
              </Text>
              <Pagination
                value={currentPage}
                onChange={setPage}
                total={totalPages}
                size="sm"
              />
            </Group>
          </Stack>
        </Card>
        <Card withBorder radius="md">
          <Stack>
            <Group justify="space-between">
              <Text fw={600}>Deployment chart</Text>
              <SegmentedControl
                size="xs"
                value={chartType}
                onChange={(value) => setChartType(value as 'line' | 'bar' | 'area')}
                data={[
                  { value: 'line', label: 'Line' },
                  { value: 'bar', label: 'Bar' },
                  { value: 'area', label: 'Area' },
                ]}
              />
            </Group>
            <Group>
              <Switch
                label="Legend"
                checked={showLegend}
                onChange={(event) => setShowLegend(event.currentTarget.checked)}
              />
              <Switch
                label="Backend series"
                checked={showBackendSeries}
                onChange={(event) => setShowBackendSeries(event.currentTarget.checked)}
              />
              <Switch
                label="Loading"
                checked={isChartLoading}
                onChange={(event) => setIsChartLoading(event.currentTarget.checked)}
              />
              <Switch
                label="Empty"
                checked={isChartEmpty}
                onChange={(event) => setIsChartEmpty(event.currentTarget.checked)}
              />
            </Group>
            {isChartLoading ? (
              <Skeleton h={220} radius="md" />
            ) : chartData.length === 0 ? (
              <Text size="sm" c="dimmed">
                No chart data available for this view.
              </Text>
            ) : chartType === 'line' ? (
              <LineChart
                h={220}
                data={chartData}
                dataKey="month"
                series={series}
                withLegend={showLegend}
                curveType="natural"
                valueFormatter={(value) => `${value} deploys`}
              />
            ) : chartType === 'bar' ? (
              <BarChart
                h={220}
                data={chartData}
                dataKey="month"
                series={series}
                withLegend={showLegend}
                valueFormatter={(value) => `${value} deploys`}
              />
            ) : (
              <AreaChart
                h={220}
                data={chartData}
                dataKey="month"
                series={series}
                withLegend={showLegend}
                valueFormatter={(value) => `${value} deploys`}
              />
            )}
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  )
}
