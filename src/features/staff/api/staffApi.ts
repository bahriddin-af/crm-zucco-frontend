import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type {
  StaffListItem,
  StaffDetail,
  CreateOrUpdateStaffRequest,
  StaffRoleType,
} from '../types/staffTypes'

export const staffApi = {
  getList: async (page = 1, pageSize = 50, search = '', role?: StaffRoleType) => {
    const params: Record<string, unknown> = { page, pageSize }
    if (search) params.search = search
    if (role !== undefined) params.role = role

    const response = await apiClient.get<ApiResponse<PagedResult<StaffListItem>>>(
      API_ROUTES.STAFF.LIST,
      { params }
    )
    return response.data.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<StaffDetail>>(
      API_ROUTES.STAFF.DETAIL(id)
    )
    return response.data.data
  },

  upsert: async (payload: CreateOrUpdateStaffRequest) => {
    const response = await apiClient.post<ApiResponse<StaffDetail>>(
      API_ROUTES.STAFF.CREATE_OR_UPDATE,
      payload
    )
    return response.data.data
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<string>>(
      API_ROUTES.STAFF.DELETE(id)
    )
    return response.data.data
  },
}
