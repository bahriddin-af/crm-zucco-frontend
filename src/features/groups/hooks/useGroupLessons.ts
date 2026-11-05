import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { interpolate, useTranslation } from '@/i18n'
import { groupApi } from '../api/groupApi'
import type { GenerateGroupScheduleRequest } from '../types/groupTypes'

export function useGroupLessons(groupId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.GROUPS.LESSONS(groupId),
    queryFn: () => groupApi.getLessons(groupId),
    enabled: Boolean(groupId),
  })
}

interface GenerateScheduleVariables extends GenerateGroupScheduleRequest {
  groupId: string
}

/** Jadval generatsiyasi idempotent: qayta chaqirilsa mavjud darslar takrorlanmaydi. */
export function useGenerateSchedule() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ groupId, ...payload }: GenerateScheduleVariables) => groupApi.generateSchedule(groupId, payload),
    meta: { invalidates: [QUERY_KEYS.GROUPS.ALL, QUERY_KEYS.SCHEDULE.ALL] },
    onSuccess: (lessons) => {
      toast.success(interpolate(t.groups.generated, { count: lessons.length }))
    },
  })
}

interface CancelLessonVariables {
  lessonId: string
  reason: string
}

export function useCancelLesson() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ lessonId, reason }: CancelLessonVariables) => groupApi.cancelLesson(lessonId, reason),
    meta: { invalidates: [QUERY_KEYS.GROUPS.ALL, QUERY_KEYS.SCHEDULE.ALL, QUERY_KEYS.ATTENDANCE.ALL] },
    onSuccess: () => {
      toast.success(t.groups.lessonCancelled)
    },
  })
}
