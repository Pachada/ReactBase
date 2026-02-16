import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { loadAuthState, saveAuthState } from '@/core/auth/auth-storage'
import type { AuthState, LoginCredentials, Role } from '@/core/auth/types'

const DEMO_PASSWORD = 'changeme'

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  hasRole: (roles: Role[]) => boolean
}

const defaultState: AuthState = {
  user: null,
  token: null,
  status: 'anonymous',
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthState>(() => loadAuthState())

  const login = useCallback(async (credentials: LoginCredentials) => {
    if (credentials.password !== DEMO_PASSWORD) {
      throw new Error('Invalid credentials. Use password "changeme".')
    }

    const nextState: AuthState = {
      user: {
        id: crypto.randomUUID(),
        name: credentials.username,
        email: `${credentials.username.toLowerCase()}@example.com`,
        role: credentials.role,
      },
      token: `demo-token-${Date.now()}`,
      status: 'authenticated',
    }

    saveAuthState(nextState)
    setAuthState(nextState)
  }, [])

  const logout = useCallback(() => {
    saveAuthState(defaultState)
    setAuthState(defaultState)
  }, [])

  const hasRole = useCallback(
    (roles: Role[]) =>
      authState.status === 'authenticated' &&
      authState.user !== null &&
      roles.includes(authState.user.role),
    [authState.status, authState.user],
  )

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
      hasRole,
    }),
    [authState, hasRole, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
