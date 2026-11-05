import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import type { ApiResponse, PagedResult } from '@/types/api'
import type { SendSmsRequest, SmsLog, SmsLogsFilter, SmsTemplate, UpsertSmsTemplateRequest } from '../types/smsTypes'

export const smsApi = {
  getTemplates: async () => {
    const response = await apiClient.get<ApiResponse<SmsTemplate[]>>(API_ROUTES.NOTIFICATIONS.TEMPLATES)
    return response.data.data
  },

  upsertTemplate: async (payload: UpsertSmsTemplateRequest) => {
    const response = await apiClient.post<ApiResponse<SmsTemplate>>(API_ROUTES.NOTIFICATIONS.TEMPLATES, payload)
    return response.data.data
  },

  send: async (payload: SendSmsRequest) => {
    const response = await apiClient.post<ApiResponse<SmsLog>>(API_ROUTES.NOTIFICATIONS.SMS_SEND, payload)
    return response.data.data
  },

  getLogs: async (filter: SmsLogsFilter) => {
    const response = await apiClient.get<ApiResponse<PagedResult<SmsLog>>>(API_ROUTES.NOTIFICATIONS.SMS_LOGS, {
      params: filter,
    })
    return response.data.data
  },
}
