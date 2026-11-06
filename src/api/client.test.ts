import axios, { AxiosError, AxiosHeaders, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'
import { apiClient, attachRequestContext, getApiBaseUrl, readOperationId, refreshAccessToken } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import { HTTP_STATUS } from '@/constants/http'
import { HTTP_HEADERS } from '@/constants/http'
import { useAuthStore } from '@/stores/authStore'

const session = {
  id: 'user-1',
  fullName: 'Owner',
  phone: '+998901234567',
  roles: ['Owner'],
  permissions: [],
  branchIds: ['branch-1'],
}

const requestConfig = (method: string, data?: unknown): InternalAxiosRequestConfig => ({
  method,
  data,
  headers: new AxiosHeaders(),
})

describe('attachRequestContext', () => {
  beforeEach(() => {
    useAuthStore.getState().setAuth('access-token', 'refresh-token', session)
  })

  it('reuses the body operationId as the X-Operation-Id header', () => {
    const config = attachRequestContext(requestConfig('post', { operationId: 'op-123', amount: 1 }))

    expect(config.headers.get(HTTP_HEADERS.OPERATION_ID)).toBe('op-123')
    expect(config.headers.get(HTTP_HEADERS.AUTHORIZATION)).toBe('Bearer access-token')
    expect(config.headers.get(HTTP_HEADERS.BRANCH_ID)).toBe('branch-1')
  })

  it('generates an operation id for writes without one and none for reads', () => {
    const write = attachRequestContext(requestConfig('delete'))
    const read = attachRequestContext(requestConfig('get'))

    expect(write.headers.get(HTTP_HEADERS.OPERATION_ID)).toMatch(/^[0-9a-f-]{36}$/)
    expect(read.headers.get(HTTP_HEADERS.OPERATION_ID)).toBeUndefined()
  })

  it('ignores empty or non-string operation ids', () => {
    expect(readOperationId({ operationId: '' })).toBeUndefined()
    expect(readOperationId({ operationId: 42 })).toBeUndefined()
    expect(readOperationId(null)).toBeUndefined()
  })
})

describe('refreshAccessToken', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shares one refresh request between concurrent callers and rotates both tokens', async () => {
    useAuthStore.getState().setAuth('expired', 'refresh-1', session)
    const post = vi.spyOn(axios, 'post').mockResolvedValue({
      data: { success: true, code: 'ok', data: { accessToken: 'access-2', refreshToken: 'refresh-2' } },
    })

    const [first, second] = await Promise.all([refreshAccessToken(), refreshAccessToken()])

    expect(post).toHaveBeenCalledTimes(1)
    expect([first, second]).toEqual(['access-2', 'access-2'])
    expect(useAuthStore.getState()).toMatchObject({ token: 'access-2', refreshToken: 'refresh-2' })
  })

  it('rejects without a network call when there is no refresh token', async () => {
    useAuthStore.getState().logout()
    const post = vi.spyOn(axios, 'post')

    await expect(refreshAccessToken()).rejects.toThrow()
    expect(post).not.toHaveBeenCalled()
  })
})

describe('401 handling', () => {
  const unauthorized = (config: InternalAxiosRequestConfig) =>
    new AxiosError('Unauthorized', AxiosError.ERR_BAD_REQUEST, config, undefined, {
      status: HTTP_STATUS.UNAUTHORIZED,
      statusText: '',
      headers: {},
      config,
      data: { success: false, code: 'invalid_credentials' },
    })

  /** Birinchi chaqiruvda 401, keyingilarida 200 qaytaradigan soxta transport. */
  const unauthorizedOnceAdapter = () =>
    vi.fn<AxiosAdapter>((config) =>
      config.headers.get(HTTP_HEADERS.AUTHORIZATION) === 'Bearer access-2'
        ? Promise.resolve({ data: { success: true }, status: 200, statusText: '', headers: {}, config })
        : Promise.reject(unauthorized(config))
    )

  beforeEach(() => {
    useAuthStore.getState().setAuth('expired', 'refresh-1', session)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('refreshes the token and retries an ordinary request once', async () => {
    const refresh = vi.spyOn(axios, 'post').mockResolvedValue({
      data: { success: true, code: 'ok', data: { accessToken: 'access-2', refreshToken: 'refresh-2' } },
    })
    const adapter = unauthorizedOnceAdapter()

    const response = await apiClient.get(API_ROUTES.AUTH.ME, { adapter })

    expect(response.status).toBe(200)
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(adapter).toHaveBeenCalledTimes(2)
  })

  it.each([API_ROUTES.AUTH.LOGIN, API_ROUTES.AUTH.REFRESH, API_ROUTES.AUTH.CHANGE_PASSWORD])(
    'surfaces the original 401 from %s without refreshing',
    async (route) => {
      const refresh = vi.spyOn(axios, 'post')
      const adapter = unauthorizedOnceAdapter()

      const request = apiClient.post(route, { password: 'wrong' }, { adapter })

      await expect(request).rejects.toMatchObject({
        response: { status: HTTP_STATUS.UNAUTHORIZED, data: { code: 'invalid_credentials' } },
      })
      expect(refresh).not.toHaveBeenCalled()
      expect(adapter).toHaveBeenCalledTimes(1)
      expect(useAuthStore.getState().token).toBe('expired')
    }
  )
})

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('uses VITE_API_URL as is and never guesses from the hostname', () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    expect(getApiBaseUrl()).toBe('https://api.example.test')
  })

  it('falls back to the same origin (dev /api proxy) when VITE_API_URL is not set', () => {
    vi.stubEnv('VITE_API_URL', undefined)
    expect(getApiBaseUrl()).toBe('')
  })
})
