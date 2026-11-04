import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { courseApi } from '../api/courseApi'
import type { CreateCourseRequest, CourseListItem } from '../types/courseTypes'

export function useCoursesList(filters?: { subjectId?: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.COURSES.LIST(filters),
    queryFn: () => courseApi.getCourses(filters),
  })
}

export function useSubjectsList() {
  return useQuery({
    queryKey: ['courses', 'subjects'],
    queryFn: () => courseApi.getSubjects(),
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => courseApi.createOrUpdateSubject(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', 'subjects'] })
      toast.success('Янги таълим йўналиши яратилди!')
    },
    onError: () => {
      toast.error('Йўналиш яратишда хатолик юз берди')
    },
  })
}

export function useSaveCourse(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCourseRequest) => courseApi.createOrUpdateCourse(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL })
      toast.success(
        variables.id ? 'Курс муваффақиятли янгиланди!' : 'Янги курс муваффақиятли қўшилди!'
      )
      onSuccessCallback?.()
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Курсни сақлашда хатолик юз берди')
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (course: CourseListItem) => courseApi.deleteCourse(course.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL })
      toast.success('Курс муваффақиятли ўчирилди!')
    },
    onError: () => {
      toast.error('Курсни ўчиришда хатолик юз берди')
    },
  })
}
