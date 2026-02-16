import { useState } from 'react';
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
import { toast } from '@/app/components/ui/sonner';
import { sanitizeInput } from '@/app/utils/validation';

export function HomePage() {
  const [projectName, setProjectName] = useState('ReactBase');

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Welcome to {projectName}</CardTitle>
            <Badge>Starter</Badge>
          </div>
          <CardDescription>
            A reusable skeleton with routing, role context, typed API layer, and shadcn/ui
            components.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-xs">
            <Select
              onValueChange={(value) => setProjectName(sanitizeInput(value, 30))}
              value={projectName}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose starter label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ReactBase">ReactBase</SelectItem>
                <SelectItem value="Admin Console">Admin Console</SelectItem>
                <SelectItem value="Operations Portal">Operations Portal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => toast.success('ReactBase scaffold is ready to customize.')}>
            Show toast notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
