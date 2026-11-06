import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { interpolate, useTranslation } from '@/i18n'
import { studentRiskApi } from '../api/studentRiskApi'
import type { StudentRiskFilters } from '../types/studentRiskTypes'

export function useStudentRiskList(filters: StudentRiskFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENTS.RISK_LIST({ ...filters }),
    queryFn: () => studentRiskApi.getRiskList(filters),
    placeholderData: keepPreviousData,
  })
}

export function useStudentRiskSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENTS.RISK_SUMMARY,
    queryFn: () => studentRiskApi.getRiskSummary(),
  })
}

export function useStudentRiskHistory(studentId: string, days: number) {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENTS.RISK_HISTORY(studentId, days),
    queryFn: () => studentRiskApi.getRiskHistory(studentId, days),
    enabled: Boolean(studentId),
  })
}

/** Xatolar global toast qilinadi; muvaffaqiyatda nechta talaba baholangani ko'rsatiladi. */
export function useRecalculateStudentRisk() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: () => studentRiskApi.recalculate(),
    meta: { invalidates: [QUERY_KEYS.STUDENTS.RISK_ALL] },
    onSuccess: (result) => {
      toast.success(interpolate(t.risk.toasts.recalculated, { count: result.evaluated }))
    },
  })
}
