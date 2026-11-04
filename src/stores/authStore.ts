import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserSession {
  id: string
  fullName: string
  phone: string
  role: string
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
  setActiveBranchId: (branchId: string) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
}

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

      setActiveBranchId: (branchId) =>
        set({
          activeBranchId: branchId,
        }),

      logout: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
          activeBranchId: null,
          isAuthenticated: false,
        }),

      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false
        // Owner rolida barcha ruxsatnomalar bor
        if (user.role === 'Owner') return true
        return user.permissions.includes(permission)
      },
    }),
    {
      name: 'zucco-auth-storage',
    }
  )
)
