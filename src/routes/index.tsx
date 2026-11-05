import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './paths'
import { ProtectedRoute } from './ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { OverviewPage } from '@/features/overview/pages/OverviewPage'
import { LeadsPage } from '@/features/leads/pages/LeadsPage'
import { StudentListPage } from '@/features/students/pages/StudentListPage'
import { StudentDetailPage } from '@/features/students/pages/StudentDetailPage'
import { GroupListPage } from '@/features/groups/pages/GroupListPage'
import { CourseListPage } from '@/features/courses/pages/CourseListPage'
import { SchedulePage } from '@/features/schedule/pages/SchedulePage'
import { AttendanceJournalPage } from '@/features/attendance/pages/AttendanceJournalPage'
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

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
      <Route path="/login" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />

      {/* Protected CRM App Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path={ROUTES.OVERVIEW} element={<OverviewPage />} />

          {/* Reception / Leads */}
          <Route path={ROUTES.LEADS.LIST} element={<LeadsPage />} />

          {/* Students */}
          <Route path={ROUTES.STUDENTS.LIST} element={<StudentListPage />} />
          <Route path={ROUTES.STUDENTS.DETAIL} element={<StudentDetailPage />} />

          {/* Academic */}
          <Route path={ROUTES.COURSES.LIST} element={<CourseListPage />} />
          <Route path={ROUTES.GROUPS.LIST} element={<GroupListPage />} />
          <Route path={ROUTES.SCHEDULE} element={<SchedulePage />} />
          <Route path={ROUTES.ATTENDANCE.JOURNAL} element={<AttendanceJournalPage />} />

          {/* Finance & Team */}
          <Route path={ROUTES.FINANCE.DESK} element={<FinanceDeskPage />} />
          <Route path={ROUTES.FINANCE.EXPENSES} element={<ExpensesPage />} />
          <Route path={ROUTES.FINANCE.PAYROLL} element={<PayrollPage />} />
          <Route path={ROUTES.STAFF.LIST} element={<StaffListPage />} />
          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />

          {/* Gamification */}
          <Route path={ROUTES.MARKET.ITEMS} element={<MarketPage />} />
          <Route path={ROUTES.MARKET.COIN_ACTIVITY} element={<CoinActivityPage />} />

          {/* Notifications & Settings */}
          <Route path={ROUTES.NOTIFICATIONS.SMS} element={<SmsCenterPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.STAFF.ROLES} element={<RolesPermissionsPage />} />
          <Route path={ROUTES.BRANCHES} element={<BranchesPage />} />
        </Route>
      </Route>

      {/* Fallback to Overview */}
      <Route path="*" element={<Navigate to={ROUTES.OVERVIEW} replace />} />
    </Routes>
  )
}
