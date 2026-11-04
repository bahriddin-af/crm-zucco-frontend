import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type {
  CourseListItem,
  SubjectItem,
  CreateCourseRequest,
} from '../types/courseTypes'

export const courseApi = {
  getCourses: async (params?: { page?: number; pageSize?: number; subjectId?: string }) => {
    const response = await apiClient.get<ApiResponse<PagedResult<CourseListItem>>>(
      API_ROUTES.COURSES.LIST,
      { params: { page: 1, pageSize: 50, ...params } }
    )
    return response.data.data
  },

  getSubjects: async () => {
    const response = await apiClient.get<ApiResponse<SubjectItem[]>>(
      API_ROUTES.COURSES.SUBJECTS
    )
    return response.data.data
  },

  createOrUpdateSubject: async (name: string, description = '') => {
    const response = await apiClient.post<ApiResponse<SubjectItem>>(
      API_ROUTES.COURSES.SUBJECTS,
      { name, description }
    )
    return response.data.data
  },

  createOrUpdateCourse: async (payload: CreateCourseRequest) => {
    const response = await apiClient.post<ApiResponse<CourseListItem>>(
      API_ROUTES.COURSES.CREATE_OR_UPDATE,
      payload
    )
    return response.data.data
  },

  deleteCourse: async (id: string) => {
    const response = await apiClient.delete<ApiResponse>(API_ROUTES.COURSES.DELETE(id))
    return response.data
  },
}
