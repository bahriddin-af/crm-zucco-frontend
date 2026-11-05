import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type {
  CourseListFilters,
  CourseListItem,
  CourseResponse,
  CreateOrUpdateCourseRequest,
  CreateOrUpdateSubjectRequest,
  SubjectItem,
} from '../types/courseTypes'

const DEFAULT_LIST_PAGE_SIZE = 50

export const courseApi = {
  getCourses: async (filters?: CourseListFilters) => {
    const response = await apiClient.get<ApiResponse<PagedResult<CourseListItem>>>(API_ROUTES.COURSES.LIST, {
      params: { page: 1, pageSize: DEFAULT_LIST_PAGE_SIZE, ...filters },
    })
    return response.data.data
  },

  getCourseById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<CourseResponse>>(API_ROUTES.COURSES.DETAIL(id))
    return response.data.data
  },

  createOrUpdateCourse: async (payload: CreateOrUpdateCourseRequest) => {
    const response = await apiClient.post<ApiResponse<CourseResponse>>(API_ROUTES.COURSES.CREATE_OR_UPDATE, payload)
    return response.data.data
  },

  deleteCourse: async (id: string) => {
    const response = await apiClient.delete<ApiResponse>(API_ROUTES.COURSES.DELETE(id))
    return response.data
  },

  getSubjects: async () => {
    const response = await apiClient.get<ApiResponse<SubjectItem[]>>(API_ROUTES.COURSES.SUBJECTS)
    return response.data.data
  },

  createOrUpdateSubject: async (payload: CreateOrUpdateSubjectRequest) => {
    const response = await apiClient.post<ApiResponse<SubjectItem>>(API_ROUTES.COURSES.SUBJECTS, payload)
    return response.data.data
  },

  deleteSubject: async (id: string) => {
    const response = await apiClient.delete<ApiResponse>(API_ROUTES.COURSES.SUBJECT_DETAIL(id))
    return response.data
  },
}
