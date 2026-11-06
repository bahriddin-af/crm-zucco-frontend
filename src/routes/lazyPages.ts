import { lazy, type ComponentType } from 'react'

/**
 * Sahifa modulini alohida chunk sifatida yuklaydi (React.lazy faqat `default` eksportni qabul qiladi,
 * sahifalar esa nomlangan eksport — shu yerda moslashtiriladi).
 */
function lazyPage<TModule extends Record<TName, ComponentType>, TName extends string>(
  loader: () => Promise<TModule>,
  name: TName
) {
  return lazy(async () => ({ default: (await loader())[name] }))
}

export const OverviewPage = lazyPage(() => import('@/features/overview/pages/OverviewPage'), 'OverviewPage')
export const LeadsPage = lazyPage(() => import('@/features/leads/pages/LeadsPage'), 'LeadsPage')
export const StudentListPage = lazyPage(() => import('@/features/students/pages/StudentListPage'), 'StudentListPage')
export const StudentDetailPage = lazyPage(
  () => import('@/features/students/pages/StudentDetailPage'),
  'StudentDetailPage'
)
export const GroupListPage = lazyPage(() => import('@/features/groups/pages/GroupListPage'), 'GroupListPage')
export const GroupDetailPage = lazyPage(() => import('@/features/groups/pages/GroupDetailPage'), 'GroupDetailPage')
export const CourseListPage = lazyPage(() => import('@/features/courses/pages/CourseListPage'), 'CourseListPage')
export const CourseDetailPage = lazyPage(() => import('@/features/courses/pages/CourseDetailPage'), 'CourseDetailPage')
export const SchedulePage = lazyPage(() => import('@/features/schedule/pages/SchedulePage'), 'SchedulePage')
export const AttendanceJournalPage = lazyPage(
  () => import('@/features/attendance/pages/AttendanceJournalPage'),
  'AttendanceJournalPage'
)
export const TeacherAttendancePage = lazyPage(
  () => import('@/features/attendance/pages/TeacherAttendancePage'),
  'TeacherAttendancePage'
)
export const FinanceDeskPage = lazyPage(() => import('@/features/finance/pages/FinanceDeskPage'), 'FinanceDeskPage')
export const ExpensesPage = lazyPage(() => import('@/features/finance/pages/ExpensesPage'), 'ExpensesPage')
export const PayrollPage = lazyPage(() => import('@/features/finance/pages/PayrollPage'), 'PayrollPage')
export const StaffListPage = lazyPage(() => import('@/features/staff/pages/StaffListPage'), 'StaffListPage')
export const MarketPage = lazyPage(() => import('@/features/market/pages/MarketPage'), 'MarketPage')
export const CoinActivityPage = lazyPage(() => import('@/features/market/pages/CoinActivityPage'), 'CoinActivityPage')
export const SmsCenterPage = lazyPage(() => import('@/features/notifications/pages/SmsCenterPage'), 'SmsCenterPage')
export const ReportsPage = lazyPage(() => import('@/features/reports/pages/ReportsPage'), 'ReportsPage')
export const SettingsPage = lazyPage(() => import('@/features/settings/pages/SettingsPage'), 'SettingsPage')
export const RolesPermissionsPage = lazyPage(
  () => import('@/features/settings/pages/RolesPermissionsPage'),
  'RolesPermissionsPage'
)
export const BranchesPage = lazyPage(() => import('@/features/branches/pages/BranchesPage'), 'BranchesPage')
