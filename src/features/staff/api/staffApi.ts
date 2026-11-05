import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type {
  CreateOrUpdateStaffRequest,
  StaffDetail,
  StaffListItem,
  StaffRoleDto,
  StaffRoleType,
} from '../types/staffTypes'

export interface StaffListParams {
  page: number
  pageSize: number
  search?: string
  role?: StaffRoleType
}

export const staffApi = {
  getList: async ({ page, pageSize, search, role }: StaffListParams) => {
    const response = await apiClient.get<ApiResponse<PagedResult<StaffListItem>>>(API_ROUTES.STAFF.LIST, {
      params: { page, pageSize, search: search || undefined, role },
    })
    return response.data.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<StaffDetail>>(API_ROUTES.STAFF.DETAIL(id))
    return response.data.data
  },

  getRoles: async () => {
    const response = await apiClient.get<ApiResponse<StaffRoleDto[]>>(API_ROUTES.STAFF.ROLES)
    return response.data.data
  },

  upsert: async (payload: CreateOrUpdateStaffRequest) => {
    const response = await apiClient.post<ApiResponse<StaffDetail>>(API_ROUTES.STAFF.CREATE_OR_UPDATE, payload)
    return response.data.data
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse>(API_ROUTES.STAFF.DELETE(id))
    return response.data
  },
}
