import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse } from '@/types/api'
import type { MonthlyReportResponse } from '../types/reportTypes'

export const reportsApi = {
  /** `period` — `yyyy-MM`; berilmasa backend joriy oyni oladi. */
  getMonthly: async (period?: string) => {
    const response = await apiClient.get<ApiResponse<MonthlyReportResponse>>(API_ROUTES.REPORTS.MONTHLY, {
      params: { period },
    })
    return response.data.data
  },
}
