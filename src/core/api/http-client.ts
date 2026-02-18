import { ApiError } from '@/core/api/ApiError'
import { env } from '@/core/config/env'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  token?: string | null
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

export class HttpClient {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async request<TResponse>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<TResponse | undefined> {
    const requestHeaders = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    })

    if (options.token) {
      requestHeaders.set('Authorization', `Bearer ${options.token}`)
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: options.method ?? 'GET',
      headers: requestHeaders,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      throw new ApiError(
        `Request failed with status ${response.status}`,
        response.status,
        errorBody,
      )
    }

    if (response.status === 204) {
      return undefined
    }

    return (await response.json()) as TResponse
  }
}

export const apiClient = new HttpClient(env.apiBaseUrl)
