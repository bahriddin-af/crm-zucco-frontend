import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useTranslation } from '@/i18n'
import { groupApi } from '../api/groupApi'
import type { ChangeStudentGroupStatusRequest } from '../types/groupTypes'

interface ChangeStudentStatusVariables extends ChangeStudentGroupStatusRequest {
  groupId: string
  studentId: string
}

export function useChangeStudentGroupStatus() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ groupId, studentId, ...payload }: ChangeStudentStatusVariables) =>
      groupApi.changeStudentStatus(groupId, studentId, payload),
    meta: { invalidates: [QUERY_KEYS.GROUPS.ALL, QUERY_KEYS.STUDENTS.ALL, QUERY_KEYS.ATTENDANCE.ALL] },
    onSuccess: () => {
      toast.success(t.groups.studentStatusChanged)
    },
  })
}
