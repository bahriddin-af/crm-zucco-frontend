import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type {
  CreateOrUpdateStudentRequest,
  EnrollStudentRequest,
  FreezeStudentRequest,
  StudentDetail,
  StudentListFilters,
  StudentListItem,
} from '../types/studentTypes'

/** Filtr berilmasa (masalan, boshqa modullardagi talaba tanlagichlari) shu hajmdagi sahifa olinadi. */
const DEFAULT_PICKER_PAGE_SIZE = 50

export const studentApi = {
  getStudents: async (filters?: StudentListFilters) => {
    const response = await apiClient.get<ApiResponse<PagedResult<StudentListItem>>>(API_ROUTES.STUDENTS.LIST, {
      params: { page: 1, pageSize: DEFAULT_PICKER_PAGE_SIZE, ...filters },
    })
    return response.data.data
  },

  getStudentById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<StudentDetail>>(API_ROUTES.STUDENTS.DETAIL(id))
    return response.data.data
  },

  createOrUpdateStudent: async (payload: CreateOrUpdateStudentRequest) => {
    const response = await apiClient.post<ApiResponse<StudentDetail>>(API_ROUTES.STUDENTS.CREATE_OR_UPDATE, payload)
    return response.data.data
  },

  freezeStudent: async (payload: FreezeStudentRequest) => {
    const response = await apiClient.post<ApiResponse>(API_ROUTES.STUDENTS.FREEZE(payload.studentId), payload)
    return response.data
  },

  unfreezeStudent: async (studentId: string) => {
    const response = await apiClient.post<ApiResponse>(API_ROUTES.STUDENTS.UNFREEZE(studentId))
    return response.data
  },

  enrollStudentToGroup: async (payload: EnrollStudentRequest) => {
    const response = await apiClient.post<ApiResponse>(API_ROUTES.GROUPS.STUDENTS(payload.groupId), payload)
    return response.data
  },

  deleteStudent: async (id: string) => {
    const response = await apiClient.delete<ApiResponse>(API_ROUTES.STUDENTS.DETAIL(id))
    return response.data
  },
}
