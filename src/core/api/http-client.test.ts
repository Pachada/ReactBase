import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HttpClient } from '@/core/api/http-client'

const BASE_URL = 'https://api.test'

function makeResponse(status: number, body: unknown = null): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response
}

const fetchMock = vi.fn()

describe('HttpClient', () => {
  let client: HttpClient

  beforeEach(() => {
    client = new HttpClient(BASE_URL)
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('returns parsed JSON for a successful GET', async () => {
    fetchMock.mockResolvedValue(makeResponse(200, { id: 1 }))
    const result = await client.request<{ id: number }>('/items')
    expect(result).toEqual({ id: 1 })
  })

  it('returns undefined for a 204 No Content response', async () => {
    fetchMock.mockResolvedValue(makeResponse(204))
    const result = await client.request('/items/1', { method: 'DELETE' })
    expect(result).toBeUndefined()
  })

  it('throws ApiError for a non-OK response', async () => {
    fetchMock.mockResolvedValue(makeResponse(404, { error: 'not found' }))
    await expect(client.request('/missing')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
    })
  })

  it('retries with the refreshed token after a 401', async () => {
    const refreshHandler = vi.fn().mockResolvedValue('new-token')
    client.setRefreshHandler(refreshHandler)
    fetchMock
      .mockResolvedValueOnce(makeResponse(401))
      .mockResolvedValueOnce(makeResponse(200, { data: 'ok' }))

    const result = await client.request<{ data: string }>('/secure', {
      token: 'old-token',
    })

    expect(refreshHandler).toHaveBeenCalledOnce()
    expect(result).toEqual({ data: 'ok' })
    // Retry request must carry the new token
    const retryHeaders = fetchMock.mock.calls[1][1]?.headers as Headers
    expect(retryHeaders.get('Authorization')).toBe('Bearer new-token')
  })

  it('calls logoutHandler and throws ApiError when refresh returns null', async () => {
    const refreshHandler = vi.fn().mockResolvedValue(null)
    const logoutHandler = vi.fn()
    client.setRefreshHandler(refreshHandler)
    client.setLogoutHandler(logoutHandler)
    fetchMock.mockResolvedValue(makeResponse(401))

    await expect(client.request('/secure', { token: 'old' })).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
    })
    expect(logoutHandler).toHaveBeenCalledOnce()
  })

  it('calls refreshHandler only once for concurrent 401s', async () => {
    const refreshHandler = vi.fn().mockResolvedValue('fresh-token')
    client.setRefreshHandler(refreshHandler)
    fetchMock
      .mockResolvedValueOnce(makeResponse(401))
      .mockResolvedValueOnce(makeResponse(401))
      .mockResolvedValueOnce(makeResponse(401))
      .mockResolvedValue(makeResponse(200, {}))

    await Promise.all([
      client.request('/a', { token: 'old' }),
      client.request('/b', { token: 'old' }),
      client.request('/c', { token: 'old' }),
    ])

    expect(refreshHandler).toHaveBeenCalledOnce()
  })
})
