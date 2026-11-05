import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { OfflineBanner } from '@/components/common/OfflineBanner'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/utils/cn'

export function AppShell() {
  const isCollapsed = useAppStore((state) => state.isSidebarCollapsed)
  const setIsOnline = useAppStore((state) => state.setIsOnline)
  const location = useLocation()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setIsOnline])

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-200',
          isCollapsed ? 'pl-18' : 'pl-64'
        )}
      >
        <OfflineBanner />
        <Topbar />
        <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
