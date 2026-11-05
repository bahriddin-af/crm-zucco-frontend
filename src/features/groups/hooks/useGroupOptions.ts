import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { groupApi } from '../api/groupApi'

/** Guruh formasi va jadval filtrlari uchun tanlangan filial xonalari (picker). */
export function useRoomOptions(branchId?: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.BRANCHES.ROOMS(branchId ?? ''),
    queryFn: () => groupApi.getRooms(branchId ?? ''),
    enabled: Boolean(branchId),
    select: (result) => result.items,
  })
}
