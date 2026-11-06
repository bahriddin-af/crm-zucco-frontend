import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type {
  StudentRiskFilters,
  StudentRiskHistoryPoint,
  StudentRiskItem,
  StudentRiskRecalculationResult,
  StudentRiskSummary,
} from '../types/studentRiskTypes'

export const studentRiskApi = {
  getRiskList: async (filters: StudentRiskFilters) => {
    const response = await apiClient.get<ApiResponse<PagedResult<StudentRiskItem>>>(API_ROUTES.STUDENTS.RISK, {
      params: filters,
    })
    return response.data.data
  },

  getRiskSummary: async (branchId?: string) => {
    const response = await apiClient.get<ApiResponse<StudentRiskSummary>>(API_ROUTES.STUDENTS.RISK_SUMMARY, {
      params: { branchId },
    })
    return response.data.data
  },

  getRiskHistory: async (studentId: string, days: number) => {
    const response = await apiClient.get<ApiResponse<StudentRiskHistoryPoint[]>>(
      API_ROUTES.STUDENTS.RISK_HISTORY(studentId),
      { params: { days } }
    )
    return response.data.data
  },

  recalculate: async () => {
    const response = await apiClient.post<ApiResponse<StudentRiskRecalculationResult>>(
      API_ROUTES.STUDENTS.RISK_RECALCULATE
    )
    return response.data.data
  },
}
