import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useTranslation } from '@/i18n'
import { studentApi } from '../api/studentApi'
import type {
  CreateOrUpdateStudentRequest,
  EnrollStudentRequest,
  FreezeStudentRequest,
  StudentListFilters,
} from '../types/studentTypes'

export function useStudentsList(filters?: StudentListFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENTS.LIST(filters),
    queryFn: () => studentApi.getStudents(filters),
    placeholderData: keepPreviousData,
  })
}

export function useStudentDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENTS.DETAIL(id),
    queryFn: () => studentApi.getStudentById(id),
    enabled: Boolean(id),
  })
}

export function useSaveStudent() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateStudentRequest) => studentApi.createOrUpdateStudent(payload),
    meta: { invalidates: [QUERY_KEYS.STUDENTS.ALL] },
    onSuccess: (_data, payload) => {
      toast.success(payload.id ? t.students.toasts.updated : t.students.toasts.created)
    },
  })
}

export function useFreezeStudent() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: FreezeStudentRequest) => studentApi.freezeStudent(payload),
    meta: { invalidates: [QUERY_KEYS.STUDENTS.ALL] },
    onSuccess: () => {
      toast.success(t.students.toasts.frozen)
    },
  })
}

export function useUnfreezeStudent() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (studentId: string) => studentApi.unfreezeStudent(studentId),
    meta: { invalidates: [QUERY_KEYS.STUDENTS.ALL] },
    onSuccess: () => {
      toast.success(t.students.toasts.unfrozen)
    },
  })
}

export function useEnrollStudent() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: EnrollStudentRequest) => studentApi.enrollStudentToGroup(payload),
    meta: { invalidates: [QUERY_KEYS.STUDENTS.ALL, QUERY_KEYS.GROUPS.ALL] },
    onSuccess: () => {
      toast.success(t.students.toasts.enrolled)
    },
  })
}

export function useDeleteStudent() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (id: string) => studentApi.deleteStudent(id),
    meta: { invalidates: [QUERY_KEYS.STUDENTS.ALL, QUERY_KEYS.GROUPS.ALL] },
    onSuccess: () => {
      toast.success(t.students.toasts.deleted)
    },
  })
}
