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
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { PERMISSIONS, type Permission } from '@/constants/permissions'
import { ROUTES } from '@/routes/paths'
import type { Translations } from '@/i18n'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  /** Bo'lim ma'lumotini o'qish uchun backend talab qiladigan ruxsat. Yo'q bo'lsa — hamma uchun ochiq. */
  permission?: Permission
}

export interface NavSection {
  title: string
  items: NavItem[]
}

/** Har bir bandning ruxsati shu sahifa chaqiradigan asosiy GET endpointining `[HasPermission]` qiymati. */
export function buildNavSections(t: Translations): NavSection[] {
  return [
    {
      title: t.nav.mainSection,
      items: [{ label: t.nav.overview, to: ROUTES.OVERVIEW, icon: LayoutDashboard }],
    },
    {
      title: t.nav.receptionSection,
      items: [
        { label: t.nav.leads, to: ROUTES.LEADS.LIST, icon: Users, permission: PERMISSIONS.LEADS.VIEW },
        { label: t.nav.students, to: ROUTES.STUDENTS.LIST, icon: GraduationCap, permission: PERMISSIONS.STUDENTS.VIEW },
        { label: t.nav.smsCenter, to: ROUTES.NOTIFICATIONS.SMS, icon: MessageSquare, permission: PERMISSIONS.NOTIFICATIONS.VIEW },
      ],
    },
    {
      title: t.nav.academicSection,
      items: [
        { label: t.nav.courses, to: ROUTES.COURSES.LIST, icon: BookOpen, permission: PERMISSIONS.COURSES.VIEW },
        { label: t.nav.groups, to: ROUTES.GROUPS.LIST, icon: FolderKanban, permission: PERMISSIONS.GROUPS.VIEW },
        { label: t.nav.schedule, to: ROUTES.SCHEDULE, icon: CalendarDays, permission: PERMISSIONS.GROUPS.VIEW },
        { label: t.nav.attendance, to: ROUTES.ATTENDANCE.JOURNAL, icon: CheckSquare, permission: PERMISSIONS.ATTENDANCE.VIEW },
      ],
    },
    {
      title: t.nav.financeSection,
      items: [
        { label: t.nav.financeDesk, to: ROUTES.FINANCE.DESK, icon: Wallet, permission: PERMISSIONS.FINANCE.VIEW },
        { label: t.nav.expenses, to: ROUTES.FINANCE.EXPENSES, icon: Receipt, permission: PERMISSIONS.FINANCE.VIEW },
        { label: t.nav.payroll, to: ROUTES.FINANCE.PAYROLL, icon: Banknote, permission: PERMISSIONS.PAYROLL.VIEW },
        { label: t.nav.staff, to: ROUTES.STAFF.LIST, icon: UserCheck, permission: PERMISSIONS.STAFF.VIEW },
        { label: t.nav.reports, to: ROUTES.REPORTS, icon: BarChart3, permission: PERMISSIONS.FINANCE.VIEW },
      ],
    },
    {
      title: t.nav.incentiveSection,
      items: [
        { label: t.nav.rewardMarket, to: ROUTES.MARKET.ITEMS, icon: Gift, permission: PERMISSIONS.GAMIFICATION.VIEW },
        { label: t.nav.coinHistory, to: ROUTES.MARKET.COIN_ACTIVITY, icon: Coins, permission: PERMISSIONS.GAMIFICATION.VIEW },
      ],
    },
    {
      title: t.nav.managementSection,
      items: [
        { label: t.nav.branches, to: ROUTES.BRANCHES, icon: Building2, permission: PERMISSIONS.BRANCHES.VIEW },
        { label: t.nav.settings, to: ROUTES.SETTINGS, icon: Settings },
        { label: t.nav.roles, to: ROUTES.STAFF.ROLES, icon: ShieldCheck, permission: PERMISSIONS.STAFF.ROLES_MANAGE },
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
      items: section.items.filter((item) => !item.permission || hasPermission(item.permission)),
    }))
    .filter((section) => section.items.length > 0)
}

/** Backend rol nomini joriy tildagi nomga aylantiradi (noma'lum rol o'z nomi bilan ko'rsatiladi). */
export function formatRoles(roles: string[], t: Translations): string {
  if (roles.length === 0) return t.layout.noRole
  const labels: Record<string, string> = t.layout.roles
  return roles.map((role) => labels[role] ?? role).join(', ')
}
