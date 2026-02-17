import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { AUTH_REMEMBER_KEY, loadAuthState, saveAuthState } from '@/core/auth/auth-storage'
import type { AuthState, LoginCredentials, Role } from '@/core/auth/types'

const DEMO_PASSWORD = 'changeme'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<void>
  logout: () => void
  hasRole: (roles: Role[]) => boolean
  sessionExpiresAt: number | null
  resetSessionTimer: () => void
}

const defaultState: AuthState = {
  user: null,
  token: null,
  status: 'anonymous',
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthState>(() => loadAuthState())
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null)

  const resetSessionTimer = useCallback(() => {
    if (authState.status === 'authenticated') {
      setSessionExpiresAt(Date.now() + SESSION_TIMEOUT_MS)
    }
  }, [authState.status])

  const login = useCallback(async (credentials: LoginCredentials, rememberMe = false) => {
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

    saveAuthState(nextState, rememberMe)
    setAuthState(nextState)

    // Only set session timeout if not remembering (session storage)
    if (!rememberMe) {
      setSessionExpiresAt(Date.now() + SESSION_TIMEOUT_MS)
    } else {
      setSessionExpiresAt(null)
    }
  }, [])

  const logout = useCallback(() => {
    saveAuthState(defaultState)
    setAuthState(defaultState)
    setSessionExpiresAt(null)
  }, [])

  const hasRole = useCallback(
    (roles: Role[]) =>
      authState.status === 'authenticated' &&
      authState.user !== null &&
      roles.includes(authState.user.role),
    [authState.status, authState.user],
  )

  // Initialize session timer on mount if logged in with session storage
  useEffect(() => {
    if (authState.status === 'authenticated') {
      const rememberMe = window.localStorage.getItem(AUTH_REMEMBER_KEY) === 'true'
      if (!rememberMe && !sessionExpiresAt) {
        // Use setTimeout to avoid setting state directly in effect
        const timer = setTimeout(() => {
          setSessionExpiresAt(Date.now() + SESSION_TIMEOUT_MS)
        }, 0)
        return () => clearTimeout(timer)
      }
    }
  }, [authState.status, sessionExpiresAt])

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
      hasRole,
      sessionExpiresAt,
      resetSessionTimer,
    }),
    [authState, hasRole, login, logout, sessionExpiresAt, resetSessionTimer],
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
