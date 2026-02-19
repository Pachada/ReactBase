import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { apiClient } from '@/core/api/http-client'
import { rolesApi } from '@/features/admin/roles-api'
import { sessionApi } from '@/core/api/session-api'
import {
  getRememberMePreference,
  loadAuthState,
  saveAuthState,
} from '@/core/auth/auth-storage'
import type { AuthState, AuthUser, LoginCredentials, Role } from '@/core/auth/types'
import type { AuthEnvelope } from '@/core/api/types'

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<void>
  loginWithEnvelope: (envelope: AuthEnvelope, rememberMe?: boolean) => Promise<void>
  logout: () => void
  hasRole: (roles: Role[]) => boolean
  // sessionExpiresAt kept for API compat (null — server manages sessions)
  sessionExpiresAt: number | null
  resetSessionTimer: () => void
}

const anonymousState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  status: 'anonymous',
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthState>(() => loadAuthState())

  const doSilentRefresh = useCallback(
    (refreshToken: string | null): Promise<string | null> => {
      if (!refreshToken) return Promise.resolve(null)
      return sessionApi
        .refresh(refreshToken)
        .then((envelope) => {
          if (!envelope?.access_token) return null
          setAuthState((prev) => {
            if (prev.status !== 'authenticated' || !prev.user) return prev
            const next: AuthState = {
              ...prev,
              token: envelope.access_token,
              refreshToken: envelope.refresh_token ?? prev.refreshToken,
            }
            saveAuthState(next, getRememberMePreference())
            return next
          })
          return envelope.access_token
        })
        .catch(() => null)
    },
    [],
  )

  // Wire refresh/logout handlers whenever auth state changes
  useEffect(() => {
    if (authState.status === 'authenticated') {
      apiClient.setRefreshHandler(() => doSilentRefresh(authState.refreshToken))
      apiClient.setLogoutHandler(() => {
        setAuthState(anonymousState)
        saveAuthState(anonymousState)
      })
    }
  }, [authState.status, authState.refreshToken, doSilentRefresh])

  const applyEnvelope = useCallback(
    async (envelope: AuthEnvelope, rememberMe = false) => {
      if (!envelope?.access_token) throw new Error('Login failed: empty response')
      const { access_token, refresh_token, user: apiUser } = envelope
      if (!apiUser) throw new Error('Login failed: missing user in response')

      let roleName = 'viewer'
      // NoSQL sends "role": "Admin"; SQL sends "role_id": 3 — handle both
      const roleIdentifier = apiUser.role ?? apiUser.role_id
      try {
        const roles = await rolesApi.listRoles(access_token)
        const matched = roles.find(
          (r) =>
            String(r.id) === String(roleIdentifier) ||
            r.name.toLowerCase() === String(roleIdentifier).toLowerCase(),
        )
        if (matched) {
          roleName = matched.name.toLowerCase()
        } else if (roleIdentifier) {
          // Only treat non-numeric identifiers as role names (numeric ones are unresolved IDs)
          const identifierStr = String(roleIdentifier)
          if (!/^\d+$/.test(identifierStr.trim())) roleName = identifierStr.toLowerCase()
        }
      } catch {
        // non-fatal: only treat non-numeric identifiers as role names
        if (roleIdentifier) {
          const identifierStr = String(roleIdentifier)
          if (!/^\d+$/.test(identifierStr.trim())) roleName = identifierStr.toLowerCase()
        }
      }

      const user: AuthUser = {
        id: apiUser.id,
        username: apiUser.username,
        name:
          `${apiUser.first_name ?? ''} ${apiUser.last_name ?? ''}`.trim() ||
          apiUser.username,
        email: apiUser.email,
        role_id: roleIdentifier as AuthUser['role_id'],
        roleName,
      }

      const nextState: AuthState = {
        user,
        token: access_token,
        refreshToken: refresh_token ?? null,
        status: 'authenticated',
      }

      try {
        saveAuthState(nextState, rememberMe)
      } catch (error) {
        throw error instanceof Error ? error : new Error('Failed to persist auth state')
      }
      setAuthState(nextState)
    },
    [],
  )

  const login = useCallback(
    async (credentials: LoginCredentials, rememberMe = false) => {
      const envelope = await sessionApi.login(credentials)
      if (!envelope) throw new Error('Login failed: empty response')
      await applyEnvelope(envelope, rememberMe)
    },
    [applyEnvelope],
  )

  const loginWithEnvelope = useCallback(
    (envelope: AuthEnvelope, rememberMe = false) => applyEnvelope(envelope, rememberMe),
    [applyEnvelope],
  )

  const logout = useCallback(() => {
    const token = authState.token
    if (token) {
      sessionApi.logout(token).catch(() => {
        /* fire-and-forget */
      })
    }
    apiClient.setRefreshHandler(null)
    saveAuthState(anonymousState)
    setAuthState(anonymousState)
  }, [authState.token])

  const hasRole = useCallback(
    (roles: Role[]) =>
      authState.status === 'authenticated' &&
      authState.user !== null &&
      roles.includes(authState.user.roleName),
    [authState.status, authState.user],
  )

  const value = useMemo(
    () => ({
      ...authState,
      login,
      loginWithEnvelope,
      logout,
      hasRole,
      sessionExpiresAt: null,
      resetSessionTimer: () => {},
    }),
    [authState, hasRole, login, loginWithEnvelope, logout],
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
