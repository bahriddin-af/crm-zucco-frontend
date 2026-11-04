import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  MessageSquare,
  BookOpen,
  FolderKanban,
  CalendarDays,
  CheckSquare,
  Wallet,
  Receipt,
  Banknote,
  UserCheck,
  BarChart3,
  Gift,
  Coins,
  Building2,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'

export function Sidebar() {
  const isCollapsed = useAppStore((state) => state.isSidebarCollapsed)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)
  const user = useAuthStore((state) => state.user)
  const { t } = useTranslation()

  interface NavItem {
    label: string
    to: string
    icon: typeof LayoutDashboard
    badge?: string
  }

  interface NavSection {
    title: string
    items: NavItem[]
  }

  const navSections: NavSection[] = [
    {
      title: t.nav.mainSection,
      items: [
        {
          label: t.nav.overview,
          to: ROUTES.OVERVIEW,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: t.nav.receptionSection,
      items: [
        {
          label: t.nav.leads,
          to: ROUTES.LEADS.LIST,
          icon: Users,
          badge: '12',
        },
        {
          label: t.nav.students,
          to: ROUTES.STUDENTS.LIST,
          icon: GraduationCap,
        },
        {
          label: t.nav.smsCenter,
          to: ROUTES.NOTIFICATIONS.SMS,
          icon: MessageSquare,
        },
      ],
    },
    {
      title: t.nav.academicSection,
      items: [
        {
          label: t.nav.courses,
          to: ROUTES.COURSES.LIST,
          icon: BookOpen,
        },
        {
          label: t.nav.groups,
          to: ROUTES.GROUPS.LIST,
          icon: FolderKanban,
        },
        {
          label: t.nav.schedule,
          to: ROUTES.SCHEDULE,
          icon: CalendarDays,
        },
        {
          label: t.nav.attendance,
          to: ROUTES.ATTENDANCE.JOURNAL,
          icon: CheckSquare,
        },
      ],
    },
    {
      title: t.nav.financeSection,
      items: [
        {
          label: t.nav.financeDesk,
          to: ROUTES.FINANCE.DESK,
          icon: Wallet,
        },
        {
          label: t.nav.expenses,
          to: ROUTES.FINANCE.EXPENSES,
          icon: Receipt,
        },
        {
          label: t.nav.payroll,
          to: ROUTES.FINANCE.PAYROLL,
          icon: Banknote,
        },
        {
          label: t.nav.staff,
          to: ROUTES.STAFF.LIST,
          icon: UserCheck,
        },
        {
          label: t.nav.reports,
          to: ROUTES.REPORTS,
          icon: BarChart3,
        },
      ],
    },
    {
      title: t.nav.incentiveSection,
      items: [
        {
          label: t.nav.rewardMarket,
          to: ROUTES.MARKET.ITEMS,
          icon: Gift,
        },
        {
          label: t.nav.coinHistory,
          to: ROUTES.MARKET.COIN_ACTIVITY,
          icon: Coins,
        },
      ],
    },
    {
      title: t.nav.managementSection,
      items: [
        {
          label: t.nav.branches,
          to: ROUTES.BRANCHES,
          icon: Building2,
        },
        {
          label: t.nav.settings,
          to: ROUTES.SETTINGS,
          icon: Settings,
        },
        {
          label: t.nav.roles,
          to: ROUTES.STAFF.ROLES,
          icon: ShieldCheck,
        },
      ],
    },
  ]

  return (
    <aside
      className={cn(
        'fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-white border-r border-[#E3EAE5] transition-all duration-200 select-none',
        isCollapsed ? 'w-[72px] px-2.5 py-4' : 'w-[240px] px-3.5 py-4'
      )}
    >
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-5">
        <div className="w-[30px] h-[30px] rounded-lg bg-[#146B52] text-white flex items-center justify-center font-bold text-lg leading-none shrink-0">
          Z
        </div>
        {!isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <span className="font-bold text-lg text-[#1E2B24] tracking-tight">
              zucco
            </span>
            <span className="text-[10px] font-medium text-[#146B52] bg-[#E8F3ED] px-1.5 py-0.5 rounded">
              CRM 2.0
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto space-y-4 pr-0.5 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-2.5 text-[10px] font-semibold text-[#8B9C91] tracking-wider uppercase mb-1.5">
                {section.title}
              </h4>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-md text-xs font-medium min-h-[36px] transition-colors',
                    isCollapsed ? 'justify-center px-0' : 'px-2.5',
                    isActive
                      ? 'bg-[#E8F3ED] text-[#146B52] font-semibold'
                      : 'text-[#4D6255] hover:bg-[#F6F8F7]'
                  )
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-[#D7EADF] text-[#146B52] font-semibold px-1.5 py-0.2 rounded shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer with User Info & Collapse Toggle */}
      <div className="pt-3 border-t border-[#E3EAE5] flex items-center gap-2">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 flex-1 min-w-0 px-1">
            <div className="w-7 h-7 rounded-full bg-[#D7EADF] text-[#0F5943] border border-[#BBDCCB] flex items-center justify-center text-[10px] font-bold shrink-0">
              {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'ZU'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#1E2B24] truncate leading-tight">
                {user?.fullName || 'Администратор'}
              </p>
              <p className="text-[10px] text-[#65776C] truncate leading-tight">
                {user?.role || 'Owner'}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Кенгайтириш' : 'Кичрайтириш'}
          className={cn(
            'w-7 h-7 inline-flex items-center justify-center rounded-md text-[#65776C] hover:bg-[#F0F4F1] transition-colors shrink-0',
            isCollapsed && 'mx-auto'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  )
}
