import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse } from '@/types/api'
import type {
  AddLeadActivityRequest,
  ConvertLeadRequest,
  CreateOrUpdateLeadRequest,
  KanbanColumn,
  KanbanFilters,
  LeadConversionResponse,
  LeadResponse,
  LeadSourceDto,
  LeadStageDto,
  MarkLeadLostRequest,
  MoveLeadStageRequest,
} from '../types/leadTypes'

export const leadApi = {
  getKanbanBoard: async (filters?: KanbanFilters) => {
    const response = await apiClient.get<ApiResponse<KanbanColumn[]>>(API_ROUTES.LEADS.KANBAN, {
      params: filters,
    })
    return response.data.data
  },

  getLeadById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<LeadResponse>>(API_ROUTES.LEADS.DETAIL(id))
    return response.data.data
  },

  getStages: async () => {
    const response = await apiClient.get<ApiResponse<LeadStageDto[]>>(API_ROUTES.LEADS.STAGES)
    return response.data.data
  },

  getSources: async () => {
    const response = await apiClient.get<ApiResponse<LeadSourceDto[]>>(API_ROUTES.LEADS.SOURCES)
    return response.data.data
  },

  createOrUpdateLead: async (payload: CreateOrUpdateLeadRequest) => {
    const response = await apiClient.post<ApiResponse<LeadResponse>>(API_ROUTES.LEADS.CREATE_OR_UPDATE, payload)
    return response.data.data
  },

  moveStage: async (payload: MoveLeadStageRequest) => {
    const response = await apiClient.patch<ApiResponse>(API_ROUTES.LEADS.UPDATE_STAGE(payload.leadId), payload)
    return response.data
  },

  convertLead: async (payload: ConvertLeadRequest) => {
    const response = await apiClient.post<ApiResponse<LeadConversionResponse>>(
      API_ROUTES.LEADS.CONVERT(payload.leadId),
      payload
    )
    return response.data.data
  },

  markLost: async (payload: MarkLeadLostRequest) => {
    const response = await apiClient.patch<ApiResponse>(API_ROUTES.LEADS.LOST(payload.leadId), payload)
    return response.data
  },

  addActivity: async (payload: AddLeadActivityRequest) => {
    const response = await apiClient.post<ApiResponse>(API_ROUTES.LEADS.ACTIVITIES(payload.leadId), payload)
    return response.data
  },
}
