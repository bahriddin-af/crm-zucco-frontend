import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useTranslation } from '@/i18n'
import { leadApi } from '../api/leadApi'
import { moveLeadBetweenColumns } from '../utils/kanban'
import type {
  AddLeadActivityRequest,
  ConvertLeadRequest,
  CreateOrUpdateLeadRequest,
  KanbanColumn,
  KanbanFilters,
  MarkLeadLostRequest,
  MoveLeadStageRequest,
} from '../types/leadTypes'

export function useKanbanBoard(filters?: KanbanFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.LEADS.KANBAN(filters),
    queryFn: () => leadApi.getKanbanBoard(filters),
  })
}

export function useLeadStages() {
  return useQuery({
    queryKey: QUERY_KEYS.LEADS.STAGES,
    queryFn: () => leadApi.getStages(),
  })
}

export function useLeadSources() {
  return useQuery({
    queryKey: QUERY_KEYS.LEADS.SOURCES,
    queryFn: () => leadApi.getSources(),
  })
}

export function useLeadDetail(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.LEADS.DETAIL(id ?? ''),
    queryFn: () => leadApi.getLeadById(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useSaveLead() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateLeadRequest) => leadApi.createOrUpdateLead(payload),
    meta: { invalidates: [QUERY_KEYS.LEADS.ALL] },
    onSuccess: (_data, payload) => {
      toast.success(payload.id ? t.leads.toasts.updated : t.leads.toasts.created)
    },
  })
}

interface MoveContext {
  previous?: KanbanColumn[]
}

/**
 * Kanbanda lidni boshqa bosqichga o'tkazish — optimistik yangilash (RULES §3.3):
 * 1) joriy doska snapshot qilinadi va lid darhol yangi ustunga ko'chiriladi;
 * 2) xatoda snapshot qaytariladi (xato global toast orqali ko'rsatiladi);
 * 3) har ikki holatda server holati qayta yuklanadi.
 */
export function useMoveLeadStage(filters?: KanbanFilters) {
  const queryClient = useQueryClient()
  const kanbanKey = QUERY_KEYS.LEADS.KANBAN(filters)

  return useMutation<unknown, Error, MoveLeadStageRequest, MoveContext>({
    mutationFn: (payload) => leadApi.moveStage(payload),
    onMutate: async ({ leadId, targetStageId }) => {
      await queryClient.cancelQueries({ queryKey: kanbanKey })
      const previous = queryClient.getQueryData<KanbanColumn[]>(kanbanKey)
      if (previous) {
        queryClient.setQueryData(kanbanKey, moveLeadBetweenColumns(previous, leadId, targetStageId))
      }
      return { previous }
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(kanbanKey, context.previous)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADS.ALL }),
  })
}

export function useConvertLead() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: ConvertLeadRequest) => leadApi.convertLead(payload),
    meta: { invalidates: [QUERY_KEYS.LEADS.ALL, QUERY_KEYS.STUDENTS.ALL, QUERY_KEYS.GROUPS.ALL] },
    onSuccess: () => {
      toast.success(t.leads.toasts.converted)
    },
  })
}

export function useMarkLeadLost() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: MarkLeadLostRequest) => leadApi.markLost(payload),
    meta: { invalidates: [QUERY_KEYS.LEADS.ALL] },
    onSuccess: () => {
      toast.success(t.leads.toasts.markedLost)
    },
  })
}

export function useAddLeadActivity() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: AddLeadActivityRequest) => leadApi.addActivity(payload),
    meta: { invalidates: [QUERY_KEYS.LEADS.ALL] },
    onSuccess: () => {
      toast.success(t.leads.toasts.activityAdded)
    },
  })
}
