import { create } from 'zustand'

interface AppState {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  isOnline: boolean
  setIsOnline: (online: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  isOnline: navigator.onLine,
  setIsOnline: (online) => set({ isOnline: online }),
}))
