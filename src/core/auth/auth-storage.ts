import type { AuthState } from '@/core/auth/types'

const AUTH_STORAGE_KEY = 'reactbase.auth'
export const AUTH_REMEMBER_KEY = 'reactbase.auth.remember'
const anonymousState: AuthState = { user: null, token: null, status: 'anonymous' }

interface PersistedAuthState {
  user: AuthState['user']
  status: AuthState['status']
}

export function loadAuthState(): AuthState {
  const rememberMe = window.localStorage.getItem(AUTH_REMEMBER_KEY) === 'true'
  const storage = rememberMe ? window.localStorage : window.sessionStorage
  const rawState = storage.getItem(AUTH_STORAGE_KEY)

  if (!rawState) {
    return anonymousState
  }

  let parsedState: PersistedAuthState
  try {
    parsedState = JSON.parse(rawState) as PersistedAuthState
  } catch {
    storage.removeItem(AUTH_STORAGE_KEY)
    return anonymousState
  }

  if (parsedState.status !== 'authenticated' || !parsedState.user) {
    storage.removeItem(AUTH_STORAGE_KEY)
    return anonymousState
  }

  return {
    user: parsedState.user,
    token: `demo-token-${Date.now()}`,
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

  const storage = rememberMe ? window.localStorage : window.sessionStorage
  storage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      user: state.user,
      status: state.status,
    } satisfies PersistedAuthState),
  )

  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage
  otherStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getRememberMePreference(): boolean {
  return window.localStorage.getItem(AUTH_REMEMBER_KEY) === 'true'
}
