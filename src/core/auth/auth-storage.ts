import type { AuthState } from '@/core/auth/types'

const AUTH_STORAGE_KEY = 'reactbase.auth'
export const AUTH_REMEMBER_KEY = 'reactbase.auth.remember'

export function loadAuthState(): AuthState {
  // Check both localStorage and sessionStorage
  const rememberMe = window.localStorage.getItem(AUTH_REMEMBER_KEY) === 'true'
  const storage = rememberMe ? window.localStorage : window.sessionStorage
  const rawState = storage.getItem(AUTH_STORAGE_KEY)

  if (!rawState) {
    return { user: null, token: null, status: 'anonymous' }
  }

  let parsedState: AuthState
  try {
    parsedState = JSON.parse(rawState) as AuthState
  } catch {
    storage.removeItem(AUTH_STORAGE_KEY)
    return { user: null, token: null, status: 'anonymous' }
  }
  if (!parsedState.user || !parsedState.token) {
    return { user: null, token: null, status: 'anonymous' }
  }

  return { ...parsedState, status: 'authenticated' }
}

export function saveAuthState(state: AuthState, rememberMe = false): void {
  if (state.status === 'anonymous') {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    window.localStorage.removeItem(AUTH_REMEMBER_KEY)
    return
  }

  // Save remember preference
  window.localStorage.setItem(AUTH_REMEMBER_KEY, rememberMe ? 'true' : 'false')

  // Save auth state to appropriate storage
  const storage = rememberMe ? window.localStorage : window.sessionStorage
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))

  // Clear from the other storage
  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage
  otherStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getRememberMePreference(): boolean {
  return window.localStorage.getItem(AUTH_REMEMBER_KEY) === 'true'
}
