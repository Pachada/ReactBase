import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface AppStateContextValue {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo<AppStateContextValue>(
    () => ({
      isLoading,
      setIsLoading,
    }),
    [isLoading],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
