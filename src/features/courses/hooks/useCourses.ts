import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useTranslation } from '@/i18n'
import { courseApi } from '../api/courseApi'
import type {
  CourseListFilters,
  CreateOrUpdateCourseRequest,
  CreateOrUpdateSubjectRequest,
} from '../types/courseTypes'

export function useCoursesList(filters?: CourseListFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.COURSES.LIST({ ...filters }),
    queryFn: () => courseApi.getCourses(filters),
    placeholderData: keepPreviousData,
  })
}

export function useCourseDetail(id?: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.COURSES.DETAIL(id ?? ''),
    queryFn: () => courseApi.getCourseById(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useSubjectsList() {
  return useQuery({
    queryKey: QUERY_KEYS.COURSES.SUBJECTS,
    queryFn: () => courseApi.getSubjects(),
  })
}

export function useSaveSubject(onSuccessCallback?: () => void) {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateSubjectRequest) => courseApi.createOrUpdateSubject(payload),
    meta: { invalidates: [QUERY_KEYS.COURSES.ALL] },
    onSuccess: () => {
      toast.success(t.courses.subjectSaved)
      onSuccessCallback?.()
    },
  })
}

/** `cannot_delete_subject_with_courses` xatosi global toast orqali ko'rsatiladi. */
export function useDeleteSubject() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (subjectId: string) => courseApi.deleteSubject(subjectId),
    meta: { invalidates: [QUERY_KEYS.COURSES.ALL] },
    onSuccess: () => {
      toast.success(t.courses.subjectDeleted)
    },
  })
}

export function useSaveCourse(onSuccessCallback?: () => void) {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateCourseRequest) => courseApi.createOrUpdateCourse(payload),
    meta: { invalidates: [QUERY_KEYS.COURSES.ALL] },
    onSuccess: (_data, variables) => {
      toast.success(variables.id ? t.courses.updated : t.courses.created)
      onSuccessCallback?.()
    },
  })
}

export function useDeleteCourse() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (courseId: string) => courseApi.deleteCourse(courseId),
    meta: { invalidates: [QUERY_KEYS.COURSES.ALL] },
    onSuccess: () => {
      toast.success(t.courses.deleted)
    },
  })
}
