import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { attendanceApi } from '../api/attendanceApi'
import type { LessonAttendanceSheetResponse, MarkLessonAttendanceRequest } from '../types/attendanceTypes'
import { applyAttendanceMarks } from '../utils/attendanceMarks'

export { useGroupLessons, useGenerateSchedule } from '@/features/groups/hooks/useGroupLessons'

export function useStudentAttendanceHistory(studentId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ATTENDANCE.STUDENT(studentId),
    queryFn: () => attendanceApi.getStudentHistory(studentId),
    enabled: Boolean(studentId),
  })
}

export function useLessonSheet(lessonId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ATTENDANCE.LESSON(lessonId),
    queryFn: () => attendanceApi.getLessonSheet(lessonId),
    enabled: Boolean(lessonId),
  })
}

interface MarkAttendanceContext {
  previous?: LessonAttendanceSheetResponse
}

/**
 * Optimistik davomat (RULES §3.3): belgi keshga darhol yoziladi, xatoda snapshot qaytariladi,
 * yakunda varaq serverdan qayta olinadi. Xato toast'i global `MutationCache` orqali chiqadi.
 */
export function useMarkAttendance() {
  const queryClient = useQueryClient()

  return useMutation<LessonAttendanceSheetResponse, unknown, MarkLessonAttendanceRequest, MarkAttendanceContext>({
    mutationKey: QUERY_KEYS.ATTENDANCE.ALL,
    mutationFn: (payload) => attendanceApi.markAttendance(payload),
    meta: {
      invalidates: [QUERY_KEYS.GROUPS.ALL, QUERY_KEYS.SCHEDULE.ALL, QUERY_KEYS.STUDENTS.ALL, QUERY_KEYS.GAMIFICATION.ALL],
    },
    onMutate: async (payload) => {
      const queryKey = QUERY_KEYS.ATTENDANCE.LESSON(payload.lessonId)
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<LessonAttendanceSheetResponse>(queryKey)
      if (previous) {
        queryClient.setQueryData(queryKey, applyAttendanceMarks(previous, payload))
      }
      return { previous }
    },
    onError: (_error, payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.ATTENDANCE.LESSON(payload.lessonId), context.previous)
      }
    },
    onSettled: (_data, _error, payload) => {
      // Ketma-ket bosilgan belgilarda oraliq refetch optimistik holatni ustidan yozmasligi uchun
      // varaq faqat oxirgi davomat mutatsiyasi tugaganda qayta olinadi.
      if (queryClient.isMutating({ mutationKey: QUERY_KEYS.ATTENDANCE.ALL }) <= 1) {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ATTENDANCE.LESSON(payload.lessonId) })
      }
    },
  })
}
