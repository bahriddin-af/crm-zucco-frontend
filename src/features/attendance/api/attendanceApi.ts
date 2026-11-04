import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse } from '@/types/api'
import type {
  LessonAttendanceSheetResponse,
  LessonItem,
  MarkLessonAttendanceRequest,
} from '../types/attendanceTypes'

export const attendanceApi = {
  getGroupLessons: async (groupId: string) => {
    const response = await apiClient.get<ApiResponse<LessonItem[]>>(
      API_ROUTES.GROUPS.LESSONS(groupId)
    )
    return response.data.data
  },

  generateGroupSchedule: async (groupId: string, totalLessons = 12) => {
    const response = await apiClient.post<ApiResponse<LessonItem[]>>(
      API_ROUTES.GROUPS.SCHEDULE(groupId),
      { groupId, totalLessons }
    )
    return response.data.data
  },

  getLessonSheet: async (lessonId: string) => {
    const response = await apiClient.get<ApiResponse<LessonAttendanceSheetResponse>>(
      API_ROUTES.ATTENDANCE.LESSON(lessonId)
    )
    return response.data.data
  },

  markAttendance: async (payload: MarkLessonAttendanceRequest) => {
    const response = await apiClient.post<ApiResponse<LessonAttendanceSheetResponse>>(
      API_ROUTES.ATTENDANCE.MARK,
      payload
    )
    return response.data.data
  },
}
