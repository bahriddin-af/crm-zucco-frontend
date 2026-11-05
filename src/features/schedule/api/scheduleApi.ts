import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse } from '@/types/api'
import type { ScheduleLessonResponse, ScheduleQuery } from '../types/scheduleTypes'

export const scheduleApi = {
  /** Haftalik jadval: oraliq ko'pi bilan 42 kun (aks holda `schedule_range_invalid`). */
  getLessons: async (query: ScheduleQuery) => {
    const response = await apiClient.get<ApiResponse<ScheduleLessonResponse[]>>(API_ROUTES.GROUPS.SCHEDULE, {
      params: query,
    })
    return response.data.data
  },
}
