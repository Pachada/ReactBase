import { useMemo, useState } from 'react';
import { AreaChart, Table2 } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { toast } from '@/app/components/ui/sonner';

const trafficData = [
  { label: 'Mon', value: 32 },
  { label: 'Tue', value: 49 },
  { label: 'Wed', value: 41 },
  { label: 'Thu', value: 58 },
  { label: 'Fri', value: 76 },
  { label: 'Sat', value: 62 },
  { label: 'Sun', value: 53 },
];

const deploymentRows = [
  { app: 'Customer Portal', status: 'Healthy', region: 'us-east-1', latency: '128 ms' },
  { app: 'Operations Console', status: 'Healthy', region: 'eu-west-1', latency: '146 ms' },
  { app: 'Billing API', status: 'Warning', region: 'ap-south-1', latency: '241 ms' },
];

export function ComponentsShowcasePage() {
  const [environment, setEnvironment] = useState('production');

  const metrics = useMemo(() => {
    if (environment === 'staging') {
      return { visitors: '18.4k', conversion: '4.2%', uptime: '99.91%' };
    }
    if (environment === 'development') {
      return { visitors: '4.1k', conversion: '2.8%', uptime: '99.74%' };
    }
    return { visitors: '42.9k', conversion: '6.1%', uptime: '99.98%' };
  }, [environment]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <Card className="border-0 bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 text-white shadow-xl">
        <CardHeader className="space-y-3">
          <Badge className="w-fit border-white/20 bg-white/10 text-white">
            Design System Preview
          </Badge>
          <CardTitle className="text-2xl">Components Showcase</CardTitle>
          <CardDescription className="text-slate-200">
            A modern dashboard page demonstrating core and extended UI building blocks.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger className="w-48 border-white/20 bg-white/10 text-white">
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="secondary"
            onClick={() => toast.success(`Switched preview to ${environment}.`)}
          >
            Save selection
          </Button>
          <Button
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={() => toast('This page is ready to extend with app-specific widgets.')}
          >
            Show info toast
          </Button>
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Visitors</CardDescription>
            <CardTitle>{metrics.visitors}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Conversion Rate</CardDescription>
            <CardTitle>{metrics.conversion}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Service Uptime</CardDescription>
            <CardTitle>{metrics.uptime}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AreaChart className="h-4 w-4 text-primary" />
              <CardTitle>Weekly Traffic</CardTitle>
            </div>
            <CardDescription>
              Lightweight bar chart without additional chart dependencies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid h-56 grid-cols-7 items-end gap-3 rounded-lg border bg-muted/20 p-4">
              {trafficData.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-md bg-gradient-to-t from-indigo-500 to-sky-400"
                    style={{ height: `${item.value}%` }}
                    title={`${item.label}: ${item.value}`}
                  />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component Tokens</CardTitle>
            <CardDescription>
              Badge variants and button variants in one compact module.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">
                Secondary
              </Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Table2 className="h-4 w-4 text-primary" />
            <CardTitle>Deployment Summary Table</CardTitle>
          </div>
          <CardDescription>
            Reusable table primitives for operational and business datasets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deploymentRows.map((row) => (
                <TableRow key={row.app}>
                  <TableCell className="font-medium">{row.app}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Healthy' ? 'secondary' : 'outline'}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.region}</TableCell>
                  <TableCell className="text-right">{row.latency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
