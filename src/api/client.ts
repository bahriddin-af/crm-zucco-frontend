import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { API_ROUTES } from '@/api/apiRoutes'
import { BEARER_PREFIX, HTTP_HEADERS, HTTP_STATUS, WRITE_METHODS } from '@/constants/http'
import { ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'
import type { ApiResponse } from '@/types/api'

const PRODUCTION_API_URL = 'https://api.zucco.uz'
const TEST_API_URL = 'https://api-test.zucco.uz'
const TEST_HOST_MARKER = 'test'

export const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  // Dev serverda so'rovlar vite.config.ts dagi `/api` proxy orqali lokal backendga boradi.
  if (import.meta.env.DEV) return ''
  if (typeof window !== 'undefined' && window.location.hostname.includes(TEST_HOST_MARKER)) {
    return TEST_API_URL
  }
  return PRODUCTION_API_URL
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

interface TokenPair {
  accessToken: string
  refreshToken: string
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const isWriteMethod = (method?: string): boolean =>
  WRITE_METHODS.some((writeMethod) => writeMethod === method?.toLowerCase())

/** Body ichidagi `operationId` (agar bo'lsa) — backend idempotentligi aynan shu qiymatga tayanadi. */
export const readOperationId = (data: unknown): string | undefined => {
  if (typeof data !== 'object' || data === null || !('operationId' in data)) return undefined
  const { operationId } = data as { operationId?: unknown }
  return typeof operationId === 'string' && operationId.length > 0 ? operationId : undefined
}

export const attachRequestContext = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const { token, activeBranchId } = useAuthStore.getState()

  if (token && !config.headers.get(HTTP_HEADERS.AUTHORIZATION)) {
    config.headers.set(HTTP_HEADERS.AUTHORIZATION, `${BEARER_PREFIX}${token}`)
  }

  if (activeBranchId && !config.headers.get(HTTP_HEADERS.BRANCH_ID)) {
    config.headers.set(HTTP_HEADERS.BRANCH_ID, activeBranchId)
  }

  // Header va body'dagi operationId bitta UUID bo'lishi shart: backend body'dagisini tekshiradi.
  if (isWriteMethod(config.method) && !config.headers.get(HTTP_HEADERS.OPERATION_ID)) {
    config.headers.set(HTTP_HEADERS.OPERATION_ID, readOperationId(config.data) ?? uuidv4())
  }

  return config
}

apiClient.interceptors.request.use(attachRequestContext)

let refreshPromise: Promise<string> | null = null

const redirectToLogin = (): void => {
  useAuthStore.getState().logout()
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith(ROUTES.AUTH.LOGIN)) {
    window.location.assign(ROUTES.AUTH.LOGIN)
  }
}

/**
 * Bir vaqtda kelgan barcha 401 javoblar bitta refresh so'rovini kutadi (navbat),
 * so'ng yangi token bilan avtomatik qayta yuboriladi.
 */
export const refreshAccessToken = (): Promise<string> => {
  if (refreshPromise) return refreshPromise

  const { refreshToken } = useAuthStore.getState()
  if (!refreshToken) return Promise.reject(new Error('refresh_token_missing'))

  refreshPromise = axios
    .post<ApiResponse<TokenPair>>(`${getApiBaseUrl()}${API_ROUTES.AUTH.REFRESH}`, { refreshToken })
    .then((response) => {
      const { accessToken, refreshToken: rotatedRefreshToken } = response.data.data
      useAuthStore.getState().updateTokens(accessToken, rotatedRefreshToken)
      return accessToken
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

/**
 * Bu yo'llardagi 401 — sessiya muddati emas, foydalanuvchi ma'lumotlari xatosi (noto'g'ri parol,
 * yaroqsiz refresh token). Refresh + qayta yuborish asl xatoni yashirib qo'ymasligi uchun ular o'tkazib yuboriladi.
 */
const NO_REFRESH_ROUTES: readonly string[] = [
  API_ROUTES.AUTH.LOGIN,
  API_ROUTES.AUTH.REFRESH,
  API_ROUTES.AUTH.CHANGE_PASSWORD,
]

const canRefreshAndRetry = (config?: RetriableRequestConfig): config is RetriableRequestConfig =>
  config !== undefined && !config._retry && !NO_REFRESH_ROUTES.includes(config.url ?? '')

const handleResponseError = async (error: AxiosError) => {
  const originalRequest = error.config as RetriableRequestConfig | undefined

  if (error.response?.status !== HTTP_STATUS.UNAUTHORIZED || !canRefreshAndRetry(originalRequest)) {
    return Promise.reject(error)
  }

  originalRequest._retry = true

  try {
    const accessToken = await refreshAccessToken()
    originalRequest.headers.set(HTTP_HEADERS.AUTHORIZATION, `${BEARER_PREFIX}${accessToken}`)
    return apiClient(originalRequest)
  } catch (refreshError) {
    redirectToLogin()
    return Promise.reject(refreshError)
  }
}

apiClient.interceptors.response.use((response: AxiosResponse) => response, handleResponseError)
