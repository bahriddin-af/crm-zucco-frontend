import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { groupApi } from '../api/groupApi'
import type {
  CreateOrUpdateGroupRequest,
  GroupListItem,
  GroupStatus,
} from '../types/groupTypes'

export function useGroupsList(filters?: {
  status?: GroupStatus
  courseId?: string
  teacherId?: string
  branchId?: string
  search?: string
}) {
  return useQuery({
    queryKey: QUERY_KEYS.GROUPS.LIST(filters as Record<string, unknown>),
    queryFn: () => groupApi.getGroups(filters),
  })
}

export function useGroupDetail(id?: string) {
  return useQuery({
    queryKey: id ? QUERY_KEYS.GROUPS.DETAIL(id) : ['groups', 'detail', 'null'],
    queryFn: () => (id ? groupApi.getGroupById(id) : null),
    enabled: Boolean(id),
  })
}

export function useGroupDependencies(branchId: string) {
  const coursesQuery = useQuery({
    queryKey: ['courses', 'options'],
    queryFn: () => groupApi.getCourses(),
  })

  const teachersQuery = useQuery({
    queryKey: ['staff', 'teachers'],
    queryFn: () => groupApi.getTeachers(),
  })

  const roomsQuery = useQuery({
    queryKey: ['branches', branchId, 'rooms'],
    queryFn: () => groupApi.getRooms(branchId),
    enabled: Boolean(branchId),
  })

  return {
    courses: coursesQuery.data || [],
    teachers: teachersQuery.data || [],
    rooms: roomsQuery.data || [],
    isLoading:
      coursesQuery.isLoading || teachersQuery.isLoading || roomsQuery.isLoading,
  }
}

export function useSaveGroup(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateGroupRequest) =>
      groupApi.createOrUpdateGroup(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS.ALL })
      toast.success(
        variables.id
          ? 'Гуруҳ муваффақиятли янгиланди!'
          : 'Янги ўқув гуруҳи муваффақиятли очилди!'
      )
      onSuccessCallback?.()
    },
    onError: (err: unknown) => {
      const error = err as {
        response?: { data?: { code?: string; message?: string } }
      }
      const msg =
        error.response?.data?.message ||
        (error.response?.data?.code === 'RoomScheduleConflict'
          ? 'Ушбу хона ва вақтда бошқа фаол гуруҳ мавжуд!'
          : 'Гуруҳни сақлашда хатолик юз берди')
      toast.error(msg)
    },
  })
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (group: GroupListItem) => groupApi.deleteGroup(group.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS.ALL })
      toast.success('Гуруҳ муваффақиятли ўчирилди!')
    },
    onError: () => {
      toast.error('Гуруҳни ўчиришда хатолик юз берди')
    },
  })
}
