import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { attendanceApi } from '../api/attendanceApi'
import type { MarkLessonAttendanceRequest } from '../types/attendanceTypes'

export function useGroupLessons(groupId: string) {
  return useQuery({
    queryKey: ['groups', groupId, 'lessons'],
    queryFn: () => attendanceApi.getGroupLessons(groupId),
    enabled: Boolean(groupId),
  })
}

export function useLessonSheet(lessonId: string) {
  return useQuery({
    queryKey: ['attendance', 'lesson', lessonId],
    queryFn: () => attendanceApi.getLessonSheet(lessonId),
    enabled: Boolean(lessonId),
  })
}

export function useGenerateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (groupId: string) => attendanceApi.generateGroupSchedule(groupId),
    onSuccess: (_data, groupId) => {
      queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'lessons'] })
      toast.success('12 та дарс жадвали муваффақиятли генерация қилинди!')
    },
    onError: () => {
      toast.error('Дарс жадвалини яратишда хатолик юз берди')
    },
  })
}

export function useMarkAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: MarkLessonAttendanceRequest) =>
      attendanceApi.markAttendance(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'lesson', variables.lessonId],
      })
      queryClient.invalidateQueries({ queryKey: ['gamification'] })
      toast.success('Давомат ва баҳолар муваффақиятли сақланди!')
    },
    onError: () => {
      toast.error('Давоматни сақлашда хатолик юз берди')
    },
  })
}
