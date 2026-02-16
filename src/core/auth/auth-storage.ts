import type { AuthState } from '@/core/auth/types'

const AUTH_STORAGE_KEY = 'reactbase.auth'

export function loadAuthState(): AuthState {
  const rawState = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!rawState) {
    return { user: null, token: null, status: 'anonymous' }
  }

  const parsedState = JSON.parse(rawState) as AuthState
  if (!parsedState.user || !parsedState.token) {
    return { user: null, token: null, status: 'anonymous' }
  }

  return { ...parsedState, status: 'authenticated' }
}

export function saveAuthState(state: AuthState): void {
  if (state.status === 'anonymous') {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
}
