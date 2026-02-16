import { Home, LayoutGrid } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useAuth } from '@/app/contexts/AuthContext';

export function AppLayout() {
  const { currentRole, setCurrentRole } = useAuth();
  const handleRoleChange = (value: string) => {
    if (value === 'admin' || value === 'user' || value === 'viewer') {
      setCurrentRole(value);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-8 w-8" />
            <span className="text-lg font-semibold">ReactBase</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">Role: {currentRole}</Badge>
            <Select value={currentRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <nav className="border-b bg-background" aria-label="Main navigation">
        <div className="mx-auto flex w-full max-w-6xl px-6">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              [
                'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
              ].join(' ')
            }
          >
            <Home className="h-4 w-4" />
            Home
          </NavLink>
          <NavLink
            to="/components"
            className={({ isActive }) =>
              [
                'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
              ].join(' ')
            }
          >
            <LayoutGrid className="h-4 w-4" />
            Components
          </NavLink>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
