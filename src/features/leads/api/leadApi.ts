import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type {
  KanbanColumn,
  LeadListItem,
  LeadStageDto,
  LeadSourceDto,
  CreateOrUpdateLeadRequest,
  MoveLeadStageRequest,
  ConvertLeadRequest,
  MarkLeadLostRequest,
} from '../types/leadTypes'

export const leadApi = {
  getKanbanBoard: async (params?: { branchId?: string; courseId?: string }) => {
    const response = await apiClient.get<ApiResponse<KanbanColumn[]>>(
      API_ROUTES.LEADS.KANBAN,
      { params }
    )
    return response.data.data
  },

  getLeads: async (params?: {
    page?: number
    pageSize?: number
    stageId?: string
    courseId?: string
    branchId?: string
    search?: string
  }) => {
    const response = await apiClient.get<ApiResponse<PagedResult<LeadListItem>>>(
      API_ROUTES.LEADS.LIST,
      { params: { page: 1, pageSize: 50, ...params } }
    )
    return response.data.data
  },

  getStages: async () => {
    const response = await apiClient.get<ApiResponse<LeadStageDto[]>>(
      API_ROUTES.LEADS.STAGES
    )
    return response.data.data
  },

  getSources: async () => {
    const response = await apiClient.get<ApiResponse<LeadSourceDto[]>>(
      API_ROUTES.LEADS.SOURCES
    )
    return response.data.data
  },

  createOrUpdateLead: async (payload: CreateOrUpdateLeadRequest) => {
    const response = await apiClient.post<ApiResponse<LeadListItem>>(
      API_ROUTES.LEADS.CREATE_OR_UPDATE,
      payload
    )
    return response.data.data
  },

  moveStage: async (leadId: string, targetStageId: string, comment?: string) => {
    const payload: MoveLeadStageRequest = {
      leadId,
      targetStageId,
      comment,
    }
    const response = await apiClient.patch<ApiResponse>(
      API_ROUTES.LEADS.UPDATE_STAGE(leadId),
      payload
    )
    return response.data
  },

  convertLead: async (leadId: string, groupId?: string, joinedDate?: string) => {
    const payload: ConvertLeadRequest = {
      leadId,
      groupId: groupId || null,
      joinedDate: joinedDate || new Date().toISOString().split('T')[0],
    }
    const response = await apiClient.post<ApiResponse<{ leadId: string; studentId: string }>>(
      API_ROUTES.LEADS.CONVERT(leadId),
      payload
    )
    return response.data.data
  },

  markLost: async (leadId: string, reason: number, details?: string) => {
    const payload: MarkLeadLostRequest = {
      leadId,
      reason: reason as MarkLeadLostRequest['reason'],
      details,
    }
    const response = await apiClient.patch<ApiResponse>(
      API_ROUTES.LEADS.LOST(leadId),
      payload
    )
    return response.data
  },
}
