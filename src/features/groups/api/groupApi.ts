import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type {
  GroupListItem,
  GroupResponse,
  CreateOrUpdateGroupRequest,
  RoomOption,
  TeacherOption,
  CourseOption,
  GroupStatus,
} from '../types/groupTypes'

export const groupApi = {
  getGroups: async (params?: {
    page?: number
    pageSize?: number
    status?: GroupStatus
    courseId?: string
    teacherId?: string
    branchId?: string
    search?: string
  }) => {
    const response = await apiClient.get<ApiResponse<PagedResult<GroupListItem>>>(
      API_ROUTES.GROUPS.LIST,
      {
        params: {
          page: 1,
          pageSize: 50,
          ...params,
        },
      }
    )
    return response.data.data
  },

  getGroupById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GroupResponse>>(
      API_ROUTES.GROUPS.DETAIL(id)
    )
    return response.data.data
  },

  createOrUpdateGroup: async (payload: CreateOrUpdateGroupRequest) => {
    const response = await apiClient.post<ApiResponse<GroupResponse>>(
      API_ROUTES.GROUPS.CREATE_OR_UPDATE,
      payload
    )
    return response.data.data
  },

  deleteGroup: async (id: string) => {
    const response = await apiClient.delete<ApiResponse>(API_ROUTES.GROUPS.DELETE(id))
    return response.data
  },

  // Auxiliary API calls for Group Modal dropdowns
  getCourses: async () => {
    const response = await apiClient.get<ApiResponse<PagedResult<CourseOption>>>(
      API_ROUTES.COURSES.LIST,
      { params: { pageSize: 100 } }
    )
    return response.data.data.items
  },

  getTeachers: async () => {
    const response = await apiClient.get<ApiResponse<PagedResult<TeacherOption>>>(
      API_ROUTES.STAFF.LIST,
      { params: { role: 3, pageSize: 100 } }
    )
    return response.data.data.items
  },

  getRooms: async (branchId: string) => {
    const response = await apiClient.get<ApiResponse<PagedResult<RoomOption>>>(
      API_ROUTES.BRANCHES.ROOMS(branchId),
      { params: { pageSize: 100 } }
    )
    return response.data.data.items
  },
}
