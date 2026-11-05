import type { UserSession } from '@/stores/authStore'
import type { AuthTokenResponse } from '../types/authTypes'

/** Backend token javobini mijoz sessiyasiga aylantiradi (telefon javobda yo'q, formadan olinadi). */
export function mapTokenToSession(response: AuthTokenResponse, phone: string): UserSession {
  return {
    id: response.userId,
    fullName: response.fullName,
    phone,
    roles: response.roles,
    permissions: response.permissions,
    branchIds: response.branchId ? [response.branchId] : [],
  }
}
