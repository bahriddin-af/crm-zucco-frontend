import axios, { type InternalAxiosRequestConfig } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { API_ROUTES } from '@/api/apiRoutes'
import { ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (typeof window !== 'undefined' && window.location.hostname.includes('test')) {
    return 'https://api-test.zucco.uz'
  }
  return 'https://api.zucco.uz'
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Auth token, active branch (Tenant context), and Idempotency key
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token, activeBranchId } = useAuthStore.getState()

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (activeBranchId && !config.headers['X-Branch-Id']) {
      config.headers['X-Branch-Id'] = activeBranchId
    }

    // Har bir yozish (POST, PUT, DELETE, PATCH) amali uchun X-Operation-Id (UUID v4)
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      if (!config.headers['X-Operation-Id']) {
        config.headers['X-Operation-Id'] = uuidv4()
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: 401 Token Rotation & Auto Refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      const { refreshToken, setAuth, logout, user } = useAuthStore.getState()

      // Agar refresh token yo'q bo'lsa yoki eski mock token ('rf-...') bo'lsa, sessiyani tozalab login sahifasiga yo'naltirish
      if (!refreshToken || refreshToken.startsWith('rf-')) {
        logout()
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
          window.location.href = ROUTES.AUTH.LOGIN
        }
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post<{
          success: boolean
          data: { accessToken: string; refreshToken: string }
        }>(`${getApiBaseUrl()}${API_ROUTES.AUTH.REFRESH}`, { refreshToken })

        const { accessToken: newToken, refreshToken: newRefreshToken } = response.data.data
        if (user) {
          setAuth(newToken, newRefreshToken, user)
        }

        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        logout()
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
          window.location.href = ROUTES.AUTH.LOGIN
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
