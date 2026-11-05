import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import { OPTIONS_PAGE_SIZE } from '@/constants/pagination'
import {
  type ChangeStudentGroupStatusRequest,
  type CreateOrUpdateGroupRequest,
  type GenerateGroupScheduleRequest,
  type GroupListFilters,
  type GroupListItem,
  type GroupResponse,
  type LessonItem,
  type RoomOption,
} from '../types/groupTypes'

const DEFAULT_LIST_PAGE_SIZE = 50

export const groupApi = {
  getGroups: async (filters?: GroupListFilters) => {
    const response = await apiClient.get<ApiResponse<PagedResult<GroupListItem>>>(API_ROUTES.GROUPS.LIST, {
      params: { page: 1, pageSize: DEFAULT_LIST_PAGE_SIZE, ...filters },
    })
    return response.data.data
  },

  getGroupById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GroupResponse>>(API_ROUTES.GROUPS.DETAIL(id))
    return response.data.data
  },

  createOrUpdateGroup: async (payload: CreateOrUpdateGroupRequest) => {
    const response = await apiClient.post<ApiResponse<GroupResponse>>(API_ROUTES.GROUPS.CREATE_OR_UPDATE, payload)
    return response.data.data
  },

  deleteGroup: async (id: string) => {
    const response = await apiClient.delete<ApiResponse>(API_ROUTES.GROUPS.DELETE(id))
    return response.data
  },

  changeStudentStatus: async (groupId: string, studentId: string, payload: ChangeStudentGroupStatusRequest) => {
    const response = await apiClient.patch<ApiResponse>(API_ROUTES.GROUPS.STUDENT_STATUS(groupId, studentId), {
      groupId,
      studentId,
      ...payload,
    })
    return response.data
  },

  getLessons: async (groupId: string) => {
    const response = await apiClient.get<ApiResponse<LessonItem[]>>(API_ROUTES.GROUPS.LESSONS(groupId))
    return response.data.data
  },

  /** Idempotent: mavjud darslar qayta yaratilmaydi, faqat yetishmaganlari qo'shiladi. */
  generateSchedule: async (groupId: string, payload: GenerateGroupScheduleRequest) => {
    const response = await apiClient.post<ApiResponse<LessonItem[]>>(API_ROUTES.GROUPS.GENERATE_SCHEDULE(groupId), {
      groupId,
      ...payload,
    })
    return response.data.data
  },

  /**
   * Backend body sifatida xom JSON satr (`[FromBody] string reason`) kutadi. Oldindan
   * `JSON.stringify` qilinadi: aks holda "123" kabi sabab raqam sifatida yuborilib qoladi.
   */
  cancelLesson: async (lessonId: string, reason: string) => {
    const response = await apiClient.post<ApiResponse>(API_ROUTES.GROUPS.CANCEL_LESSON(lessonId), JSON.stringify(reason))
    return response.data
  },

  getRooms: async (branchId: string) => {
    const response = await apiClient.get<ApiResponse<PagedResult<RoomOption>>>(API_ROUTES.BRANCHES.ROOMS(branchId), {
      params: { pageSize: OPTIONS_PAGE_SIZE },
    })
    return response.data.data
  },
}
