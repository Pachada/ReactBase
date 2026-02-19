import type { AuthState } from '@/core/auth/types'

const AUTH_STORAGE_KEY = 'reactbase.auth'
export const AUTH_REMEMBER_KEY = 'reactbase.auth.remember'

const anonymousState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  status: 'anonymous',
}

interface PersistedAuthState {
  user: AuthState['user']
  token: string | null
  refreshToken: string | null
  status: AuthState['status']
}

function getStorage(rememberMe: boolean): Storage {
  return rememberMe ? window.localStorage : window.sessionStorage
}

function isPersistedAuthState(value: unknown): value is PersistedAuthState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    v['status'] === 'authenticated' &&
    typeof v['token'] === 'string' &&
    v['token'].length > 0 &&
    typeof v['user'] === 'object' &&
    v['user'] !== null &&
    typeof (v['user'] as Record<string, unknown>)['id'] !== 'undefined' &&
    typeof (v['user'] as Record<string, unknown>)['username'] === 'string' &&
    typeof (v['user'] as Record<string, unknown>)['email'] === 'string'
  )
}

export function loadAuthState(): AuthState {
  const rememberMe = window.localStorage.getItem(AUTH_REMEMBER_KEY) === 'true'
  const storage = getStorage(rememberMe)
  const rawState = storage.getItem(AUTH_STORAGE_KEY)

  if (!rawState) return anonymousState

  let parsed: unknown
  try {
    parsed = JSON.parse(rawState)
  } catch {
    storage.removeItem(AUTH_STORAGE_KEY)
    return anonymousState
  }

  if (!isPersistedAuthState(parsed)) {
    storage.removeItem(AUTH_STORAGE_KEY)
    return anonymousState
  }

  return {
    user: parsed.user,
    token: parsed.token,
    refreshToken: parsed.refreshToken ?? null,
    status: 'authenticated',
  }
}

export function saveAuthState(state: AuthState, rememberMe = false): void {
  if (state.status === 'anonymous') {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    window.localStorage.removeItem(AUTH_REMEMBER_KEY)
    return
  }

  window.localStorage.setItem(AUTH_REMEMBER_KEY, rememberMe ? 'true' : 'false')

  const storage = getStorage(rememberMe)
  storage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      user: state.user,
      token: state.token,
      refreshToken: state.refreshToken,
      status: state.status,
    } satisfies PersistedAuthState),
  )

  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage
  otherStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getRememberMePreference(): boolean {
  return window.localStorage.getItem(AUTH_REMEMBER_KEY) === 'true'
}
