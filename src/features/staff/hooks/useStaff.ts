import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { OPTIONS_PAGE_SIZE } from '@/constants/pagination'
import { interpolate, useTranslation } from '@/i18n'
import { staffApi } from '../api/staffApi'
import {
  STAFF_ROLE_TYPE,
  type CreateOrUpdateStaffRequest,
  type ResetStaffPasswordRequest,
  type StaffRoleType,
} from '../types/staffTypes'

/** Imzo boshqa modullar (o'qituvchi tanlagichlari) uchun barqaror saqlanadi. */
export function useStaffList(page = 1, pageSize = 50, search = '', role?: StaffRoleType) {
  return useQuery({
    queryKey: QUERY_KEYS.STAFF.LIST({ page, pageSize, search, role }),
    queryFn: () => staffApi.getList({ page, pageSize, search, role }),
    placeholderData: keepPreviousData,
  })
}

const TEACHER_OPTIONS_PARAMS = { page: 1, pageSize: OPTIONS_PAGE_SIZE, search: '', role: STAFF_ROLE_TYPE.Teacher }

/** O'qituvchi tanlagichlari (guruh formasi, jadval/oylik filtrlari) uchun barcha o'qituvchilar. */
export function useTeacherOptions() {
  return useQuery({
    queryKey: QUERY_KEYS.STAFF.LIST(TEACHER_OPTIONS_PARAMS),
    queryFn: () => staffApi.getList(TEACHER_OPTIONS_PARAMS),
    select: (result) => result.items,
  })
}

export function useStaffDetail(id?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.STAFF.DETAIL(id ?? ''),
    queryFn: () => staffApi.getById(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useStaffRoles(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.STAFF.ROLES,
    queryFn: () => staffApi.getRoles(),
    enabled,
  })
}

export function useSaveStaff() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateStaffRequest) => staffApi.upsert(payload),
    meta: { invalidates: [QUERY_KEYS.STAFF.ALL] },
    onSuccess: (data) => {
      toast.success(interpolate(t.staff.toasts.saved, { name: data.fullName }))
    },
  })
}

export function useDeleteStaff() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (id: string) => staffApi.delete(id),
    meta: { invalidates: [QUERY_KEYS.STAFF.ALL] },
    onSuccess: () => {
      toast.success(t.staff.toasts.deleted)
    },
  })
}

/** Xatolar (`self_password_reset_not_allowed`, `protected_account`, ...) global toast qilinadi. */
export function useResetStaffPassword() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: ResetStaffPasswordRequest) => staffApi.resetPassword(payload),
    onSuccess: () => {
      toast.success(t.staff.toasts.passwordReset)
    },
  })
}
