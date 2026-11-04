import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { staffApi } from '../api/staffApi'
import type { CreateOrUpdateStaffRequest, StaffRoleType } from '../types/staffTypes'

export function useStaffList(page = 1, pageSize = 50, search = '', role?: StaffRoleType) {
  return useQuery({
    queryKey: [...QUERY_KEYS.STAFF.ALL, 'list', page, pageSize, search, role],
    queryFn: () => staffApi.getList(page, pageSize, search, role),
  })
}

export function useStaffDetail(id?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.STAFF.DETAIL(id || ''),
    queryFn: () => staffApi.getById(id!),
    enabled: !!id,
  })
}

export function useSaveStaff(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateStaffRequest) => staffApi.upsert(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STAFF.ALL })
      toast.success(`${data.fullName} маълумотлари муваффақиятли сақланди!`)
      onSuccessCallback?.()
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Ходим маълумотларини сақлашда хатолик')
    },
  })
}

export function useDeleteStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => staffApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STAFF.ALL })
      toast.success('Ходим муваффақиятли ўчирилди!')
    },
    onError: () => {
      toast.error('Ходимни ўчиришда хатолик юз берди')
    },
  })
}
