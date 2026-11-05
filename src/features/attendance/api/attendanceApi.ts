import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse } from '@/types/api'
import type { LessonAttendanceSheetResponse, MarkLessonAttendanceRequest } from '../types/attendanceTypes'

export const attendanceApi = {
  /** `API_ROUTES.ATTENDANCE.LESSON` — dars davomat varag'i. */
  getLessonSheet: async (lessonId: string) => {
    const response = await apiClient.get<ApiResponse<LessonAttendanceSheetResponse>>(
      API_ROUTES.ATTENDANCE.LESSON(lessonId)
    )
    return response.data.data
  },

  /** `API_ROUTES.ATTENDANCE.MARK` — yangilangan varaqni qaytaradi. */
  markAttendance: async (payload: MarkLessonAttendanceRequest) => {
    const response = await apiClient.post<ApiResponse<LessonAttendanceSheetResponse>>(
      API_ROUTES.ATTENDANCE.MARK,
      payload
    )
    return response.data.data
  },
}
