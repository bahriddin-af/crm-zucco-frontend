import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse } from '@/types/api'
import type { ChangePasswordRequest, CurrentUserProfile, RoleDto } from '../types/settingsTypes'

export const settingsApi = {
  getCurrentProfile: async () => {
    const response = await apiClient.get<ApiResponse<CurrentUserProfile>>(API_ROUTES.AUTH.ME)
    return response.data.data
  },

  changePassword: async (payload: ChangePasswordRequest) => {
    const response = await apiClient.post<ApiResponse>(API_ROUTES.AUTH.CHANGE_PASSWORD, payload)
    return response.data
  },

  getRoles: async () => {
    const response = await apiClient.get<ApiResponse<RoleDto[]>>(API_ROUTES.STAFF.ROLES)
    return response.data.data
  },
}
