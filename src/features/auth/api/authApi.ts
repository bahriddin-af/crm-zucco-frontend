import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse } from '@/types/api'
import type { AuthTokenResponse, CurrentUserProfileResponse, LoginRequest } from '../types/authTypes'

export const authApi = {
  /** Login'dagi 401 (noto'g'ri parol) refresh oqimini ishga tushirmaydi — `apiClient` uni o'tkazib yuboradi. */
  login: async (payload: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<AuthTokenResponse>>(API_ROUTES.AUTH.LOGIN, payload)
    return response.data.data
  },

  logout: async () => {
    const response = await apiClient.post<ApiResponse>(API_ROUTES.AUTH.LOGOUT)
    return response.data
  },

  getMe: async () => {
    const response = await apiClient.get<ApiResponse<CurrentUserProfileResponse>>(API_ROUTES.AUTH.ME)
    return response.data.data
  },
}
