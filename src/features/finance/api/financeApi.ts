import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type {
  CashAccount,
  CreateOrUpdateCashAccountRequest,
  ExpenseCategory,
  ExpenseResponse,
  ExpensesFilters,
  FinancialSummary,
  PaymentResponse,
  PaymentsFilters,
  RecordExpenseRequest,
  RecordPaymentRequest,
} from '../types/financeTypes'

export const financeApi = {
  getSummary: async () => {
    const response = await apiClient.get<ApiResponse<FinancialSummary>>(API_ROUTES.FINANCE.SUMMARY)
    return response.data.data
  },

  getCashAccounts: async () => {
    const response = await apiClient.get<ApiResponse<CashAccount[]>>(API_ROUTES.FINANCE.ACCOUNTS)
    return response.data.data
  },

  /** `API_ROUTES.FINANCE.ACCOUNTS` — upsert (`id` bo'lsa tahrirlash). */
  upsertCashAccount: async (payload: CreateOrUpdateCashAccountRequest) => {
    const response = await apiClient.post<ApiResponse<CashAccount>>(API_ROUTES.FINANCE.ACCOUNTS, payload)
    return response.data.data
  },

  getPayments: async (filters: PaymentsFilters) => {
    const response = await apiClient.get<ApiResponse<PagedResult<PaymentResponse>>>(
      API_ROUTES.FINANCE.PAYMENTS,
      { params: filters }
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

  getExpenses: async (filters: ExpensesFilters) => {
    const response = await apiClient.get<ApiResponse<PagedResult<ExpenseResponse>>>(
      API_ROUTES.FINANCE.EXPENSES,
      { params: filters }
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

  getExpenseCategories: async () => {
    const response = await apiClient.get<ApiResponse<ExpenseCategory[]>>(
      API_ROUTES.FINANCE.EXPENSE_CATEGORIES
    )
    return response.data.data
  },

  /** Oylik o'qish haqi hisob-kitobi; yaratilgan yozuvlar sonini qaytaradi. */
  runBillingJob: async () => {
    const response = await apiClient.post<ApiResponse<number>>(API_ROUTES.FINANCE.BILLING_JOBS)
    return response.data.data
  },
}
