import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { leadApi } from '../api/leadApi'
import type { CreateOrUpdateLeadRequest } from '../types/leadTypes'

export function useKanbanBoard(filters?: { branchId?: string; courseId?: string }) {
  return useQuery({
    queryKey: ['leads', 'kanban', filters],
    queryFn: () => leadApi.getKanbanBoard(filters),
  })
}

export function useLeadStages() {
  return useQuery({
    queryKey: ['leads', 'stages'],
    queryFn: () => leadApi.getStages(),
  })
}

export function useLeadSources() {
  return useQuery({
    queryKey: ['leads', 'sources'],
    queryFn: () => leadApi.getSources(),
  })
}

export function useSaveLead(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateLeadRequest) => leadApi.createOrUpdateLead(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADS.ALL })
      queryClient.invalidateQueries({ queryKey: ['leads', 'kanban'] })
      toast.success(variables.id ? 'Лид маълумотлари янгиланди!' : 'Янги лид муваффақиятли қўшилди!')
      onSuccessCallback?.()
    },
    onError: () => {
      toast.error('Лидни сақлашда хатолик юз берди')
    },
  })
}

export function useMoveLeadStage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      leadId,
      targetStageId,
      comment,
    }: {
      leadId: string
      targetStageId: string
      comment?: string
    }) => leadApi.moveStage(leadId, targetStageId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', 'kanban'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADS.ALL })
      toast.success('Лид кейинги босқичга ўтказилди!')
    },
    onError: () => {
      toast.error('Босқични ўзгартиришда хатолик юз берди')
    },
  })
}

export function useConvertLead(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      leadId,
      groupId,
      joinedDate,
    }: {
      leadId: string
      groupId?: string
      joinedDate?: string
    }) => leadApi.convertLead(leadId, groupId, joinedDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', 'kanban'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADS.ALL })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS.ALL })
      toast.success('Лид муваффақиятли талабага айлантирилди!')
      onSuccessCallback?.()
    },
    onError: () => {
      toast.error('Талабага айлантиришда хатолик юз берди')
    },
  })
}

export function useMarkLeadLost(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      leadId,
      reason,
      details,
    }: {
      leadId: string
      reason: number
      details?: string
    }) => leadApi.markLost(leadId, reason, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', 'kanban'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADS.ALL })
      toast.success('Лид архивга/йўқотилганларга ўтказилди')
      onSuccessCallback?.()
    },
    onError: () => {
      toast.error('Хатолик юз берди')
    },
  })
}
