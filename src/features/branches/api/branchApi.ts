import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type {
  BranchListItem,
  BranchesFilter,
  CreateOrUpdateBranchRequest,
  CreateOrUpdateRoomRequest,
  RoomListItem,
  RoomResponse,
  RoomsFilter,
} from '../types/branchTypes'

export const branchApi = {
  getBranches: async (filter: BranchesFilter) => {
    const response = await apiClient.get<ApiResponse<PagedResult<BranchListItem>>>(API_ROUTES.BRANCHES.LIST, {
      params: filter,
    })
    return response.data.data
  },

  upsertBranch: async (payload: CreateOrUpdateBranchRequest) => {
    const response = await apiClient.post<ApiResponse<BranchListItem>>(API_ROUTES.BRANCHES.CREATE_OR_UPDATE, payload)
    return response.data.data
  },

  deleteBranch: async (id: string) => {
    const response = await apiClient.delete<ApiResponse>(API_ROUTES.BRANCHES.DETAIL(id))
    return response.data
  },

  getRooms: async (branchId: string, filter: RoomsFilter) => {
    const response = await apiClient.get<ApiResponse<PagedResult<RoomListItem>>>(API_ROUTES.BRANCHES.ROOMS(branchId), {
      params: filter,
    })
    return response.data.data
  },

  getRoom: async (branchId: string, roomId: string) => {
    const response = await apiClient.get<ApiResponse<RoomResponse>>(API_ROUTES.BRANCHES.ROOM_DETAIL(branchId, roomId))
    return response.data.data
  },

  upsertRoom: async (payload: CreateOrUpdateRoomRequest) => {
    const response = await apiClient.post<ApiResponse<RoomResponse>>(API_ROUTES.BRANCHES.ROOMS(payload.branchId), payload)
    return response.data.data
  },

  deleteRoom: async (branchId: string, roomId: string) => {
    const response = await apiClient.delete<ApiResponse>(API_ROUTES.BRANCHES.ROOM_DETAIL(branchId, roomId))
    return response.data
  },
}
