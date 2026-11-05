import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FULL_ACCESS_ROLES, type Permission } from '@/constants/permissions'

export interface UserSession {
  id: string
  fullName: string
  phone: string
  roles: string[]
  permissions: string[]
  branchIds: string[]
}

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: UserSession | null
  activeBranchId: string | null
  isAuthenticated: boolean
  setAuth: (token: string, refreshToken: string, user: UserSession) => void
  updateTokens: (token: string, refreshToken: string) => void
  setActiveBranchId: (branchId: string) => void
  logout: () => void
  hasPermission: (permission: Permission) => boolean
}

const SIGNED_OUT_STATE = {
  token: null,
  refreshToken: null,
  user: null,
  activeBranchId: null,
  isAuthenticated: false,
}

/** Saqlangan sessiya formati o'zgarganda oshiriladi; eski formatdagi sessiya qayta login talab qiladi. */
const AUTH_STORAGE_VERSION = 2

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      activeBranchId: null,
      isAuthenticated: false,

      setAuth: (token, refreshToken, user) =>
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
          activeBranchId: user.branchIds[0] || null,
        }),

      updateTokens: (token, refreshToken) => set({ token, refreshToken }),

      setActiveBranchId: (branchId) =>
        set({
          activeBranchId: branchId,
        }),

      logout: () => set(SIGNED_OUT_STATE),

      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false
        // Backend CurrentUser.HasPermission bilan bir xil: Owner va SuperAdmin barcha ruxsatlarga ega
        if (user.roles.some((role) => FULL_ACCESS_ROLES.includes(role))) return true
        return user.permissions.includes(permission)
      },
    }),
    {
      name: 'zucco-auth-storage',
      version: AUTH_STORAGE_VERSION,
      migrate: () => SIGNED_OUT_STATE as AuthState,
    }
  )
)
