import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { OPTIONS_PAGE_SIZE } from '@/constants/pagination'
import { branchApi } from '../api/branchApi'
import type { BranchesFilter, CreateOrUpdateBranchRequest, CreateOrUpdateRoomRequest, RoomsFilter } from '../types/branchTypes'

/** Xonalar kalitlari `QUERY_KEYS.BRANCHES.ROOMS(branchId)` prefiksi ostida (filial bo'yicha invalidatsiya uchun). */
const roomsPageKey = (branchId: string, filter: RoomsFilter) => [...QUERY_KEYS.BRANCHES.ROOMS(branchId), { ...filter }] as const
const roomDetailKey = (branchId: string, roomId: string) => [...QUERY_KEYS.BRANCHES.ROOMS(branchId), roomId] as const

export function useBranchesList(filter: BranchesFilter) {
  return useQuery({
    queryKey: QUERY_KEYS.BRANCHES.LIST({ ...filter }),
    queryFn: () => branchApi.getBranches(filter),
    placeholderData: keepPreviousData,
  })
}

const BRANCH_OPTIONS_FILTER: BranchesFilter = { page: 1, pageSize: OPTIONS_PAGE_SIZE }

/** Filial tanlagichlari (Topbar, guruh formasi, jadval filtrlari) uchun barcha filiallar. */
export function useBranchOptions(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.BRANCHES.LIST({ ...BRANCH_OPTIONS_FILTER }),
    queryFn: () => branchApi.getBranches(BRANCH_OPTIONS_FILTER),
    select: (result) => result.items,
    enabled,
  })
}

export function useUpsertBranch() {
  return useMutation({
    mutationFn: (payload: CreateOrUpdateBranchRequest) => branchApi.upsertBranch(payload),
    meta: { invalidates: [QUERY_KEYS.BRANCHES.ALL] },
  })
}

export function useDeleteBranch() {
  return useMutation({
    mutationFn: (id: string) => branchApi.deleteBranch(id),
    meta: { invalidates: [QUERY_KEYS.BRANCHES.ALL] },
  })
}

export function useRoomsList(branchId: string, filter: RoomsFilter) {
  return useQuery({
    queryKey: roomsPageKey(branchId, filter),
    queryFn: () => branchApi.getRooms(branchId, filter),
    placeholderData: keepPreviousData,
  })
}

/** Tahrirlash formasi uchun (ro'yxatda `equipment` yo'q). */
export function useRoomDetail(branchId: string, roomId: string | null) {
  return useQuery({
    queryKey: roomDetailKey(branchId, roomId ?? ''),
    queryFn: () => branchApi.getRoom(branchId, roomId ?? ''),
    enabled: Boolean(roomId),
  })
}

/** Xona soni filial kartasida ko'rinadi, shuning uchun butun filiallar keshi yangilanadi. */
export function useUpsertRoom() {
  return useMutation({
    mutationFn: (payload: CreateOrUpdateRoomRequest) => branchApi.upsertRoom(payload),
    meta: { invalidates: [QUERY_KEYS.BRANCHES.ALL] },
  })
}

export function useDeleteRoom() {
  return useMutation({
    mutationFn: ({ branchId, roomId }: { branchId: string; roomId: string }) => branchApi.deleteRoom(branchId, roomId),
    meta: { invalidates: [QUERY_KEYS.BRANCHES.ALL] },
  })
}
