import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useTranslation } from '@/i18n'
import { payrollApi } from '../api/payrollApi'
import type {
  CalculateTeacherSalaryRequest,
  PayrollFilters,
  PaySalaryRequest,
  UpsertSalarySchemeRequest,
} from '../types/payrollTypes'

export function useSalarySchemes(teacherId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PAYROLL.SCHEMES({ teacherId }),
    queryFn: () => payrollApi.getSchemes(teacherId),
  })
}

export function useSalaryCalculations(filters: PayrollFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.PAYROLL.CALCULATIONS(filters),
    queryFn: () => payrollApi.getCalculations(filters),
  })
}

export function useUpsertSalaryScheme() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: UpsertSalarySchemeRequest) => payrollApi.upsertScheme(payload),
    meta: { invalidates: [QUERY_KEYS.PAYROLL.ALL] },
    onSuccess: () => {
      toast.success(t.payroll.schemes.saved)
    },
  })
}

export function useCalculateSalary() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CalculateTeacherSalaryRequest) => payrollApi.calculate(payload),
    meta: { invalidates: [QUERY_KEYS.PAYROLL.ALL] },
    onSuccess: () => {
      toast.success(t.payroll.calculations.calculated)
    },
  })
}

export function useApproveSalary() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (id: string) => payrollApi.approve(id),
    meta: { invalidates: [QUERY_KEYS.PAYROLL.ALL] },
    onSuccess: () => {
      toast.success(t.payroll.calculations.approved)
    },
  })
}

/** Maosh to'lovi kassadan xarajat yozadi — moliya va hisobotlar ham yangilanadi. */
export function usePaySalary() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: PaySalaryRequest) => payrollApi.pay(payload),
    meta: {
      invalidates: [QUERY_KEYS.PAYROLL.ALL, QUERY_KEYS.FINANCE.ALL, QUERY_KEYS.REPORTS.ALL],
    },
    onSuccess: () => {
      toast.success(t.payroll.calculations.paid)
    },
  })
}
