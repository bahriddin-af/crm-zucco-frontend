import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse } from '@/types/api'
import type {
  CalculateTeacherSalaryRequest,
  PayrollFilters,
  PaySalaryRequest,
  SalaryCalculationResponse,
  SalarySchemeResponse,
  UpsertSalarySchemeRequest,
} from '../types/payrollTypes'

export const payrollApi = {
  getSchemes: async (teacherId?: string) => {
    const response = await apiClient.get<ApiResponse<SalarySchemeResponse[]>>(
      API_ROUTES.PAYROLL.SCHEMES,
      { params: { teacherId } }
    )
    return response.data.data
  },

  upsertScheme: async (payload: UpsertSalarySchemeRequest) => {
    const response = await apiClient.post<ApiResponse<SalarySchemeResponse>>(
      API_ROUTES.PAYROLL.SCHEMES,
      payload
    )
    return response.data.data
  },

  getCalculations: async (filters: PayrollFilters) => {
    const response = await apiClient.get<ApiResponse<SalaryCalculationResponse[]>>(
      API_ROUTES.PAYROLL.CALCULATIONS,
      { params: filters }
    )
    return response.data.data
  },

  calculate: async (payload: CalculateTeacherSalaryRequest) => {
    const response = await apiClient.post<ApiResponse<SalaryCalculationResponse>>(
      API_ROUTES.PAYROLL.CALCULATIONS,
      payload
    )
    return response.data.data
  },

  approve: async (id: string) => {
    await apiClient.post<ApiResponse>(API_ROUTES.PAYROLL.APPROVE(id))
  },

  pay: async (payload: PaySalaryRequest) => {
    await apiClient.post<ApiResponse>(API_ROUTES.PAYROLL.PAY(payload.salaryCalculationId), payload)
  },
}
