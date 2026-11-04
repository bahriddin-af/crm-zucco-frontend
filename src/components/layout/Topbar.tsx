import { Search, Bell, Building2, Plus, WifiOff, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'

export function Topbar() {
  const navigate = useNavigate()
  const isOnline = useAppStore((state) => state.isOnline)
  const user = useAuthStore((state) => state.user)
  const activeBranchId = useAuthStore((state) => state.activeBranchId)
  const setActiveBranchId = useAuthStore((state) => state.setActiveBranchId)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  return (
    <header className="sticky top-0 z-20 h-14 bg-white border-b border-[#E3EAE5] px-6 flex items-center justify-between gap-4 select-none">
      {/* Left: Breadcrumbs or Active Branch Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F6F8F7] border border-[#E3EAE5] text-xs font-medium text-[#344B3E]">
          <Building2 className="w-3.5 h-3.5 text-[#146B52]" />
          <select
            value={activeBranchId || 'b1'}
            onChange={(e) => setActiveBranchId(e.target.value)}
            className="bg-transparent border-none text-xs font-medium text-[#344B3E] focus:outline-none cursor-pointer"
          >
            <option value="b1">Асосий филиал (Чилонзор)</option>
            <option value="b2">Юнусобод филиали</option>
            <option value="b3">Мирзо Улуғбек филиали</option>
          </select>
        </div>

        {!isOnline && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Офлайн режим</span>
          </div>
        )}
      </div>

      {/* Right: Search, Quick Action, Notifications, Profile, Logout */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative w-56 hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B9C91]" />
          <input
            type="search"
            placeholder="Қидириш... (⌘K)"
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F6F8F7] border border-[#E3EAE5] rounded-md text-[#1E2B24] placeholder:text-[#8B9C91] focus:outline-none focus:ring-1 focus:ring-[#146B52]"
          />
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Quick Payment Action */}
        <Link to={ROUTES.FINANCE.DESK}>
          <Button variant="primary" size="sm" className="hidden sm:inline-flex">
            <Plus className="w-3.5 h-3.5" />
            <span>Тўлов</span>
          </Button>
        </Link>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Билдиришномалар"
          className="relative w-8 h-8 rounded-md flex items-center justify-center text-[#65776C] hover:bg-[#F0F4F1] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E11D48] ring-2 ring-white" />
        </button>

        {/* Profile Avatar */}
        <div className="w-7 h-7 rounded-full bg-[#D7EADF] text-[#0F5943] border border-[#BBDCCB] flex items-center justify-center text-xs font-semibold">
          {user?.fullName ? user.fullName[0].toUpperCase() : 'Z'}
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          title="Тизимдан чиқиш"
          className="w-8 h-8 rounded-md flex items-center justify-center text-[#65776C] hover:text-[#BE123C] hover:bg-[#FFF1F2] transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
