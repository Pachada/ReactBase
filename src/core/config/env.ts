interface RuntimeEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_ENABLE_THEME_TOKEN_EDITOR?: string
}

const runtimeEnv = import.meta.env as RuntimeEnv

const parseBooleanEnv = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback
  }
  return value.toLowerCase() === 'true'
}

const apiBaseUrl = runtimeEnv.VITE_API_BASE_URL ?? ''

if (import.meta.env.PROD && apiBaseUrl.length > 0 && apiBaseUrl.startsWith('http://')) {
  throw new Error('VITE_API_BASE_URL must use HTTPS in production.')
}

export const env = {
  apiBaseUrl,
  themeTokenEditorEnabled: parseBooleanEnv(
    runtimeEnv.VITE_ENABLE_THEME_TOKEN_EDITOR,
    true,
  ),
}
