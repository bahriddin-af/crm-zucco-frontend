import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { buildNavSections, filterNavSections } from './navConfig'
import { SidebarUserCard } from './SidebarUserCard'

export function Sidebar() {
  const isCollapsed = useAppStore((state) => state.isSidebarCollapsed)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)
  // `user` ga obuna: sessiya/ruxsatlar o'zgarganda menyu qayta chiziladi.
  useAuthStore((state) => state.user)
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const { t } = useTranslation()
  const sections = filterNavSections(buildNavSections(t), hasPermission)

  return (
    <aside
      className={cn(
        'fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-surface border-r border-border transition-all duration-200 select-none',
        isCollapsed ? 'w-18 px-2.5 py-4' : 'w-64 px-3.5 py-4'
      )}
    >
      <div className="flex items-center gap-2.5 px-2 mb-5">
        <div className="w-[30px] h-[30px] rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg leading-none shrink-0">
          {t.layout.brandInitial}
        </div>
        {!isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <span className="font-bold text-lg text-heading tracking-tight">{t.layout.brandName}</span>
            <span className="text-3xs font-medium text-primary bg-primary-soft px-1.5 py-0.5 rounded">
              {t.layout.brandBadge}
            </span>
          </div>
        )}
      </div>

      <nav aria-label={t.layout.navigationLabel} className="flex-1 overflow-y-auto space-y-4 pr-0.5 scrollbar-thin">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-2.5 text-2xs font-semibold text-subtle tracking-wider uppercase mb-1.5">
                {section.title}
              </h4>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTES.OVERVIEW}
                title={isCollapsed ? item.label : undefined}
                aria-label={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md text-sm font-medium min-h-10 transition-colors',
                    isCollapsed ? 'justify-center px-0' : 'px-2.5',
                    isActive ? 'bg-primary-soft text-primary font-semibold' : 'text-copy-strong hover:bg-canvas'
                  )
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="pt-3 border-t border-border flex items-center gap-2">
        {!isCollapsed && <SidebarUserCard />}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? t.layout.expandSidebar : t.layout.collapseSidebar}
          className={cn(
            'w-7 h-7 inline-flex items-center justify-center rounded-md text-caption hover:bg-divider transition-colors shrink-0',
            isCollapsed && 'mx-auto'
          )}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  )
}
