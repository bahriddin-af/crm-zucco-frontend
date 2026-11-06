import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { interpolate, useTranslation } from '@/i18n'
import { financeApi } from '../api/financeApi'
import type {
  CreateOrUpdateCashAccountRequest,
  ExpensesFilters,
  PaymentsFilters,
  RecordExpenseRequest,
  RecordPaymentRequest,
} from '../types/financeTypes'

export function useFinanceSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.FINANCE.SUMMARY,
    queryFn: () => financeApi.getSummary(),
  })
}

export function useCashAccounts() {
  return useQuery({
    queryKey: QUERY_KEYS.FINANCE.ACCOUNTS,
    queryFn: () => financeApi.getCashAccounts(),
  })
}

export function useSaveCashAccount(onSuccessCallback?: () => void) {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateCashAccountRequest) => financeApi.upsertCashAccount(payload),
    meta: { invalidates: [QUERY_KEYS.FINANCE.ALL] },
    onSuccess: () => {
      toast.success(t.finance.accountForm.saved)
      onSuccessCallback?.()
    },
  })
}

export function usePayments(filters: PaymentsFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.FINANCE.PAYMENTS(filters),
    queryFn: () => financeApi.getPayments(filters),
    placeholderData: keepPreviousData,
  })
}

export function useExpenses(filters: ExpensesFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.FINANCE.EXPENSES(filters),
    queryFn: () => financeApi.getExpenses(filters),
    placeholderData: keepPreviousData,
  })
}

export function useExpenseCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.FINANCE.EXPENSE_CATEGORIES,
    queryFn: () => financeApi.getExpenseCategories(),
  })
}

/** Xatolar global toast qilinadi; `operationId` payload ichida keladi (tarmoq retry xavfsiz). */
export function useRecordPayment() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: RecordPaymentRequest) => financeApi.recordPayment(payload),
    meta: {
      invalidates: [QUERY_KEYS.FINANCE.ALL, QUERY_KEYS.STUDENTS.ALL, QUERY_KEYS.REPORTS.ALL],
    },
    onSuccess: (payment) => {
      toast.success(interpolate(t.finance.drawer.success, { receipt: payment.receiptNumber }))
    },
  })
}

export function useRecordExpense() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: RecordExpenseRequest) => financeApi.recordExpense(payload),
    meta: { invalidates: [QUERY_KEYS.FINANCE.ALL, QUERY_KEYS.REPORTS.ALL] },
    onSuccess: () => {
      toast.success(t.expenses.modal.success)
    },
  })
}

export function useRunBillingJob() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: () => financeApi.runBillingJob(),
    meta: {
      invalidates: [QUERY_KEYS.FINANCE.ALL, QUERY_KEYS.STUDENTS.ALL, QUERY_KEYS.REPORTS.ALL],
    },
    onSuccess: (count) => {
      toast.success(interpolate(t.finance.billingCompleted, { count }))
    },
  })
}
