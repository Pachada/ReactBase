import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { UserRole } from '@/app/types';

interface AuthContextValue {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('user');

  const value = useMemo<AuthContextValue>(
    () => ({
      currentRole,
      setCurrentRole,
      isAuthenticated: true,
    }),
    [currentRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
