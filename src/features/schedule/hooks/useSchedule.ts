import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { scheduleApi } from '../api/scheduleApi'
import type { ScheduleQuery } from '../types/scheduleTypes'

export function useScheduleRange(query: ScheduleQuery) {
  return useQuery({
    queryKey: QUERY_KEYS.SCHEDULE.RANGE({ ...query }),
    queryFn: () => scheduleApi.getLessons(query),
    placeholderData: keepPreviousData,
  })
}
