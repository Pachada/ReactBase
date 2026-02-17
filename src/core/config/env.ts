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

export const env = {
  apiBaseUrl: runtimeEnv.VITE_API_BASE_URL ?? '',
  themeTokenEditorEnabled: parseBooleanEnv(
    runtimeEnv.VITE_ENABLE_THEME_TOKEN_EDITOR,
    true,
  ),
}
