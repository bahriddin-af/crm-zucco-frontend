import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useTranslation } from '@/i18n'
import { groupApi } from '../api/groupApi'
import type { CreateOrUpdateGroupRequest, GroupListFilters } from '../types/groupTypes'

export { useGroupLessons } from './useGroupLessons'

export function useGroupsList(filters?: GroupListFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.GROUPS.LIST({ ...filters }),
    queryFn: () => groupApi.getGroups(filters),
    placeholderData: keepPreviousData,
  })
}

export function useGroupDetail(id?: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.GROUPS.DETAIL(id ?? ''),
    queryFn: () => groupApi.getGroupById(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useSaveGroup(onSuccessCallback?: () => void) {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateGroupRequest) => groupApi.createOrUpdateGroup(payload),
    meta: { invalidates: [QUERY_KEYS.GROUPS.ALL, QUERY_KEYS.SCHEDULE.ALL] },
    onSuccess: (_data, variables) => {
      toast.success(variables.id ? t.groups.updated : t.groups.created)
      onSuccessCallback?.()
    },
  })
}

export function useDeleteGroup() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (groupId: string) => groupApi.deleteGroup(groupId),
    meta: { invalidates: [QUERY_KEYS.GROUPS.ALL, QUERY_KEYS.SCHEDULE.ALL, QUERY_KEYS.STUDENTS.ALL] },
    onSuccess: () => {
      toast.success(t.groups.deleted)
    },
  })
}
