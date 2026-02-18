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

type RefreshHandler = () => Promise<string | null>
type LogoutHandler = () => void

export class HttpClient {
  private readonly baseUrl: string
  private refreshHandler: RefreshHandler | null = null
  private logoutHandler: LogoutHandler | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setRefreshHandler(handler: RefreshHandler): void {
    this.refreshHandler = handler
  }

  setLogoutHandler(handler: LogoutHandler): void {
    this.logoutHandler = handler
  }

  async request<TResponse>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<TResponse | undefined> {
    const response = await this.doRequest(endpoint, options)

    // Attempt silent token refresh on 401
    if (response.status === 401 && this.refreshHandler) {
      const newToken = await this.refreshHandler().catch(() => null)
      if (newToken) {
        const retryResponse = await this.doRequest(endpoint, {
          ...options,
          token: newToken,
        })
        return this.parseResponse<TResponse>(retryResponse)
      }
      this.logoutHandler?.()
      throw new ApiError('Session expired', 401)
    }

    return this.parseResponse<TResponse>(response)
  }

  private async doRequest(endpoint: string, options: RequestOptions): Promise<Response> {
    const requestHeaders = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    })

    if (options.token) {
      requestHeaders.set('Authorization', `Bearer ${options.token}`)
    }

    return fetch(`${this.baseUrl}${endpoint}`, {
      method: options.method ?? 'GET',
      headers: requestHeaders,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    })
  }

  private async parseResponse<TResponse>(
    response: Response,
  ): Promise<TResponse | undefined> {
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
