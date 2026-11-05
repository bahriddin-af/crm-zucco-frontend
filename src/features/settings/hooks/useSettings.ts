import { useMutation, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { settingsApi } from '../api/settingsApi'
import type { ChangePasswordRequest } from '../types/settingsTypes'

export function useCurrentProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: settingsApi.getCurrentProfile,
  })
}

/** Xatoni forma o'zi ko'rsatadi (joriy parol noto'g'ri bo'lsa — maydon ostida). */
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => settingsApi.changePassword(payload),
    meta: { silentError: true },
  })
}

export function useRoles() {
  return useQuery({
    queryKey: QUERY_KEYS.STAFF.ROLES,
    queryFn: settingsApi.getRoles,
  })
}
