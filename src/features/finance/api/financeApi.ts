import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse } from '@/types/api'
import type {
  CashAccount,
  FinancialSummary,
  RecordPaymentRequest,
  PaymentResponse,
  RecordExpenseRequest,
  ExpenseResponse,
} from '../types/financeTypes'

export const financeApi = {
  getSummary: async () => {
    const response = await apiClient.get<ApiResponse<FinancialSummary>>(
      API_ROUTES.FINANCE.SUMMARY
    )
    return response.data.data
  },

  getCashAccounts: async () => {
    const response = await apiClient.get<ApiResponse<CashAccount[]>>(
      API_ROUTES.FINANCE.ACCOUNTS
    )
    return response.data.data
  },

  recordPayment: async (payload: RecordPaymentRequest) => {
    const response = await apiClient.post<ApiResponse<PaymentResponse>>(
      API_ROUTES.FINANCE.PAYMENTS,
      payload
    )
    return response.data.data
  },

  recordExpense: async (payload: RecordExpenseRequest) => {
    const response = await apiClient.post<ApiResponse<ExpenseResponse>>(
      API_ROUTES.FINANCE.EXPENSES,
      payload
    )
    return response.data.data
  },
}
