import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { financeApi } from '../api/financeApi'
import type {
  RecordPaymentRequest,
  RecordExpenseRequest,
} from '../types/financeTypes'

export function useFinanceSummary() {
  return useQuery({
    queryKey: ['finance', 'summary'],
    queryFn: () => financeApi.getSummary(),
  })
}

export function useCashAccounts() {
  return useQuery({
    queryKey: QUERY_KEYS.FINANCE.ACCOUNTS,
    queryFn: () => financeApi.getCashAccounts(),
  })
}

export function useRecordPayment(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RecordPaymentRequest) => financeApi.recordPayment(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS.ALL })
      toast.success(
        `Тўлов қабул қилинди! Чек: #${data.receiptNumber || '101'}`
      )
      onSuccessCallback?.()
    },
    onError: () => {
      toast.error('Тўловни қабул қилишда хатолик юз берди')
    },
  })
}

export function useRecordExpense(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RecordExpenseRequest) => financeApi.recordExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      toast.success('Харажат муваффақиятли қайд этилди!')
      onSuccessCallback?.()
    },
    onError: () => {
      toast.error('Харажатни ёзишда хатолик юз берди')
    },
  })
}
