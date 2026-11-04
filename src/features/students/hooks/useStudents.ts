import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { studentApi } from '../api/studentApi'
import type {
  CreateOrUpdateStudentRequest,
  FreezeStudentRequest,
  EnrollStudentRequest,
  StudentStatus,
} from '../types/studentTypes'

export function useStudentsList(filters?: {
  status?: StudentStatus
  groupId?: string
  search?: string
}) {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENTS.LIST(filters as Record<string, unknown>),
    queryFn: () => studentApi.getStudents(filters),
  })
}

export function useStudentDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENTS.DETAIL(id),
    queryFn: () => studentApi.getStudentById(id),
    enabled: Boolean(id),
  })
}

export function useSaveStudent(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateStudentRequest) =>
      studentApi.createOrUpdateStudent(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS.ALL })
      toast.success(
        variables.id
          ? 'Талаба маълумотлари янгиланди!'
          : 'Янги талаба муваффақиятли рўйхатга олинди!'
      )
      onSuccessCallback?.()
    },
    onError: () => {
      toast.error('Талаба маълумотларини сақлашда хатолик юз берди')
    },
  })
}

export function useFreezeStudent(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: FreezeStudentRequest) =>
      studentApi.freezeStudent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS.ALL })
      toast.success('Талаба ўқиши музлатилди')
      onSuccessCallback?.()
    },
    onError: () => {
      toast.error('Музлатишда хатолик юз берди')
    },
  })
}

export function useUnfreezeStudent(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (studentId: string) => studentApi.unfreezeStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS.ALL })
      toast.success('Талаба ўқиши қайта фаоллаштирилди')
      onSuccessCallback?.()
    },
    onError: () => {
      toast.error('Фаоллаштиришда хатолик юз берди')
    },
  })
}

export function useEnrollStudent(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: EnrollStudentRequest) =>
      studentApi.enrollStudentToGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS.ALL })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS.ALL })
      toast.success('Талаба гуруҳга муваффақиятли қўшилди!')
      onSuccessCallback?.()
    },
    onError: () => {
      toast.error('Гуруҳга қўшишда хатолик юз берди')
    },
  })
}
