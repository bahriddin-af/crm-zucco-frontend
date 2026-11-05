/** Backend `Zucco.Application.Identity.Contracts.LoginRequest`. */
export interface LoginRequest {
  phone: string
  password: string
  tenantId?: string | null
}

/** Backend `AuthTokenResponse` (login va refresh javobi). */
export interface AuthTokenResponse {
  accessToken: string
  expiresIn: number
  tokenType: string
  userId: string
  fullName: string
  tenantId?: string | null
  branchId?: string | null
  roleType?: number | null
  roles: string[]
  permissions: string[]
  refreshToken: string
  refreshExpiresAt: string
}

/** Backend `CurrentUserProfileResponse` (`GET /api/auth/me`). */
export interface CurrentUserProfileResponse {
  userId: string
  fullName: string
  phone: string
  email?: string | null
  tenantId?: string | null
  branchId?: string | null
  roleType?: number | null
  roles: string[]
  permissions: string[]
}

/** Bir telefon bir nechta markazda bo'lsa backend qaytaradigan xato kodi. */
export const TENANT_SELECTION_REQUIRED_CODE = 'tenant_selection_required'
