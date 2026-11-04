import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/utils/cn'

export function AppShell() {
  const isCollapsed = useAppStore((state) => state.isSidebarCollapsed)
  const setIsOnline = useAppStore((state) => state.setIsOnline)

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
    <div className="min-h-screen bg-[#F6F8F7] flex flex-col">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-200',
          isCollapsed ? 'pl-[72px]' : 'pl-[240px]'
        )}
      >
        <Topbar />
        <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
