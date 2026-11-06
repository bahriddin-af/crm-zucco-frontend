import {
  BarChart3,
  Banknote,
  BookOpen,
  Building2,
  CalendarDays,
  CheckSquare,
  Coins,
  FolderKanban,
  Gift,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Settings,
  ShieldCheck,
  TriangleAlert,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { Permission } from '@/constants/permissions'
import { ROUTES } from '@/routes/paths'
import { getRoutePermission } from '@/routes/routePermissions'
import type { Translations } from '@/i18n'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export interface NavSection {
  title: string
  items: NavItem[]
}

/** Har bir bandning ruxsati `routes/routePermissions.ts` dagi yagona jadvaldan olinadi. */
export function buildNavSections(t: Translations): NavSection[] {
  return [
    {
      title: t.nav.mainSection,
      items: [{ label: t.nav.overview, to: ROUTES.OVERVIEW, icon: LayoutDashboard }],
    },
    {
      title: t.nav.receptionSection,
      items: [
        { label: t.nav.leads, to: ROUTES.LEADS.LIST, icon: Users },
        { label: t.nav.students, to: ROUTES.STUDENTS.LIST, icon: GraduationCap },
        { label: t.nav.studentRisk, to: ROUTES.STUDENTS.RISK, icon: TriangleAlert },
        { label: t.nav.smsCenter, to: ROUTES.NOTIFICATIONS.SMS, icon: MessageSquare },
      ],
    },
    {
      title: t.nav.academicSection,
      items: [
        { label: t.nav.courses, to: ROUTES.COURSES.LIST, icon: BookOpen },
        { label: t.nav.groups, to: ROUTES.GROUPS.LIST, icon: FolderKanban },
        { label: t.nav.schedule, to: ROUTES.SCHEDULE, icon: CalendarDays },
        { label: t.nav.attendance, to: ROUTES.ATTENDANCE.JOURNAL, icon: CheckSquare },
      ],
    },
    {
      title: t.nav.financeSection,
      items: [
        { label: t.nav.financeDesk, to: ROUTES.FINANCE.DESK, icon: Wallet },
        { label: t.nav.expenses, to: ROUTES.FINANCE.EXPENSES, icon: Receipt },
        { label: t.nav.payroll, to: ROUTES.FINANCE.PAYROLL, icon: Banknote },
        { label: t.nav.staff, to: ROUTES.STAFF.LIST, icon: UserCheck },
        { label: t.nav.reports, to: ROUTES.REPORTS, icon: BarChart3 },
      ],
    },
    {
      title: t.nav.incentiveSection,
      items: [
        { label: t.nav.rewardMarket, to: ROUTES.MARKET.ITEMS, icon: Gift },
        { label: t.nav.coinHistory, to: ROUTES.MARKET.COIN_ACTIVITY, icon: Coins },
      ],
    },
    {
      title: t.nav.managementSection,
      items: [
        { label: t.nav.branches, to: ROUTES.BRANCHES, icon: Building2 },
        { label: t.nav.settings, to: ROUTES.SETTINGS, icon: Settings },
        { label: t.nav.roles, to: ROUTES.STAFF.ROLES, icon: ShieldCheck },
      ],
    },
  ]
}

/** Ruxsat bo'lmagan bandlar va bo'sh qolgan bo'limlar olib tashlanadi. */
export function filterNavSections(
  sections: NavSection[],
  hasPermission: (permission: Permission) => boolean
): NavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const permission = getRoutePermission(item.to)
        return !permission || hasPermission(permission)
      }),
    }))
    .filter((section) => section.items.length > 0)
}

/**
 * Joriy manzilga eng aniq mos keladigan menyu bandi (`/students/risk` da faqat «Xavf», `/students/123` da «Talabalar»).
 * Bosh sahifa faqat aynan `/` da faol.
 */
export function findActiveNavPath(pathname: string, sections: NavSection[]): string | undefined {
  const matches = sections
    .flatMap((section) => section.items.map((item) => item.to))
    .filter((to) =>
      to === ROUTES.OVERVIEW ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)
    )
  return matches.sort((a, b) => b.length - a.length)[0]
}

/** Backend rol nomini joriy tildagi nomga aylantiradi (noma'lum rol o'z nomi bilan ko'rsatiladi). */
export function formatRoles(roles: string[], t: Translations): string {
  if (roles.length === 0) return t.layout.noRole
  const labels: Record<string, string> = t.layout.roles
  return roles.map((role) => labels[role] ?? role).join(', ')
}
