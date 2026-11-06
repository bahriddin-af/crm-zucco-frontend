import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './paths'
import { ProtectedRoute } from './ProtectedRoute'
import { PermissionRoute } from './PermissionRoute'
import { AccessDeniedPage } from '@/features/auth/pages/AccessDeniedPage'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { OverviewPage } from '@/features/overview/pages/OverviewPage'
import { LeadsPage } from '@/features/leads/pages/LeadsPage'
import { StudentListPage } from '@/features/students/pages/StudentListPage'
import { StudentDetailPage } from '@/features/students/pages/StudentDetailPage'
import { GroupListPage } from '@/features/groups/pages/GroupListPage'
import { GroupDetailPage } from '@/features/groups/pages/GroupDetailPage'
import { CourseListPage } from '@/features/courses/pages/CourseListPage'
import { CourseDetailPage } from '@/features/courses/pages/CourseDetailPage'
import { SchedulePage } from '@/features/schedule/pages/SchedulePage'
import { AttendanceJournalPage } from '@/features/attendance/pages/AttendanceJournalPage'
import { TeacherAttendancePage } from '@/features/attendance/pages/TeacherAttendancePage'
import { FinanceDeskPage } from '@/features/finance/pages/FinanceDeskPage'
import { ExpensesPage } from '@/features/finance/pages/ExpensesPage'
import { PayrollPage } from '@/features/finance/pages/PayrollPage'
import { StaffListPage } from '@/features/staff/pages/StaffListPage'
import { MarketPage } from '@/features/market/pages/MarketPage'
import { CoinActivityPage } from '@/features/market/pages/CoinActivityPage'
import { SmsCenterPage } from '@/features/notifications/pages/SmsCenterPage'
import { ReportsPage } from '@/features/reports/pages/ReportsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { RolesPermissionsPage } from '@/features/settings/pages/RolesPermissionsPage'
import { BranchesPage } from '@/features/branches/pages/BranchesPage'

/** Sahifani route darajasidagi ruxsat tekshiruvi bilan o'raydi (ruxsat `routePermissions.ts` dan). */
function guarded(path: string, page: ReactNode) {
  return <Route key={path} path={path} element={<PermissionRoute path={path}>{page}</PermissionRoute>} />
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
      <Route path="/login" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />

      {/* Protected CRM App Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          {guarded(ROUTES.OVERVIEW, <OverviewPage />)}
          <Route path={ROUTES.ACCESS_DENIED} element={<AccessDeniedPage />} />

          {/* Reception / Leads */}
          {guarded(ROUTES.LEADS.LIST, <LeadsPage />)}

          {/* Students */}
          {guarded(ROUTES.STUDENTS.LIST, <StudentListPage />)}
          {guarded(ROUTES.STUDENTS.DETAIL, <StudentDetailPage />)}

          {/* Academic */}
          {guarded(ROUTES.COURSES.LIST, <CourseListPage />)}
          {guarded(ROUTES.COURSES.DETAIL, <CourseDetailPage />)}
          {guarded(ROUTES.GROUPS.LIST, <GroupListPage />)}
          {guarded(ROUTES.GROUPS.DETAIL, <GroupDetailPage />)}
          {guarded(ROUTES.SCHEDULE, <SchedulePage />)}
          {guarded(ROUTES.ATTENDANCE.JOURNAL, <AttendanceJournalPage />)}
          {guarded(ROUTES.ATTENDANCE.TEACHER, <TeacherAttendancePage />)}

          {/* Finance & Team */}
          {guarded(ROUTES.FINANCE.DESK, <FinanceDeskPage />)}
          {guarded(ROUTES.FINANCE.EXPENSES, <ExpensesPage />)}
          {guarded(ROUTES.FINANCE.PAYROLL, <PayrollPage />)}
          {guarded(ROUTES.STAFF.LIST, <StaffListPage />)}
          {guarded(ROUTES.REPORTS, <ReportsPage />)}

          {/* Gamification */}
          {guarded(ROUTES.MARKET.ITEMS, <MarketPage />)}
          {guarded(ROUTES.MARKET.COIN_ACTIVITY, <CoinActivityPage />)}

          {/* Notifications & Settings */}
          {guarded(ROUTES.NOTIFICATIONS.SMS, <SmsCenterPage />)}
          {guarded(ROUTES.SETTINGS, <SettingsPage />)}
          {guarded(ROUTES.STAFF.ROLES, <RolesPermissionsPage />)}
          {guarded(ROUTES.BRANCHES, <BranchesPage />)}
        </Route>
      </Route>

      {/* Fallback to Overview */}
      <Route path="*" element={<Navigate to={ROUTES.OVERVIEW} replace />} />
    </Routes>
  )
}
