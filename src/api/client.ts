import axios, { type InternalAxiosRequestConfig } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { API_ROUTES } from '@/api/apiRoutes'
import { ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Auth token, active branch (Tenant context), and Idempotency key
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token, activeBranchId } = useAuthStore.getState()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (activeBranchId) {
      config.headers['X-Branch-Id'] = activeBranchId
    }

    // Har bir yozish (POST, PUT, DELETE, PATCH) amali uchun X-Operation-Id (UUID v4) idempotentlik kafolati
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      if (!config.headers['X-Operation-Id']) {
        config.headers['X-Operation-Id'] = uuidv4()
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: 401 Token Rotation & Auto Refresh Queue
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

      const { refreshToken, setAuth, logout, user } = useAuthStore.getState()

      if (!refreshToken || !user) {
        logout()
        window.location.href = ROUTES.AUTH.LOGIN
        return Promise.reject(error)
      }

      try {
        const response = await axios.post<{ token: string; refreshToken: string }>(
          API_ROUTES.AUTH.REFRESH,
          { refreshToken }
        )

        const { token: newToken, refreshToken: newRefreshToken } = response.data
        setAuth(newToken, newRefreshToken, user)

        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        logout()
        window.location.href = ROUTES.AUTH.LOGIN
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
