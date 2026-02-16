interface RuntimeEnv {
  readonly VITE_API_BASE_URL?: string
}

const runtimeEnv = import.meta.env as RuntimeEnv

export const env = {
  apiBaseUrl: runtimeEnv.VITE_API_BASE_URL ?? '',
}
