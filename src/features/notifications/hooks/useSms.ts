import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { smsApi } from '../api/smsApi'
import type { SendSmsRequest, SmsLogsFilter, UpsertSmsTemplateRequest } from '../types/smsTypes'

export function useSmsTemplates() {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.TEMPLATES,
    queryFn: smsApi.getTemplates,
  })
}

export function useUpsertSmsTemplate() {
  return useMutation({
    mutationFn: (payload: UpsertSmsTemplateRequest) => smsApi.upsertTemplate(payload),
    meta: { invalidates: [QUERY_KEYS.NOTIFICATIONS.TEMPLATES] },
  })
}

export function useSendSms() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SendSmsRequest) => smsApi.send(payload),
    meta: { invalidates: [QUERY_KEYS.NOTIFICATIONS.ALL] },
    // Provayder rad etganda yoki javob kelmaganda ham backend `Failed`/`Unknown` jurnal yozuvini saqlaydi.
    onError: () => void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL }),
  })
}

export function useSmsLogs(filter: SmsLogsFilter) {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.SMS_LOGS({ ...filter }),
    queryFn: () => smsApi.getLogs(filter),
    placeholderData: keepPreviousData,
  })
}
