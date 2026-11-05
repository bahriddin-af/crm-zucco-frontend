import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { reportsApi } from '../api/reportsApi'

export function useMonthlyReport(period: string) {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.MONTHLY(period),
    queryFn: () => reportsApi.getMonthly(period),
    placeholderData: keepPreviousData,
  })
}
