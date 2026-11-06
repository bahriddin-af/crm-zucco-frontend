import { Suspense, type ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './paths'
import { ProtectedRoute } from './ProtectedRoute'
import { PermissionRoute } from './PermissionRoute'
import { AccessDeniedPage } from '@/features/auth/pages/AccessDeniedPage'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import {
  OverviewPage,
  LeadsPage,
  StudentListPage,
  StudentDetailPage,
  StudentRiskPage,
  GroupListPage,
  GroupDetailPage,
  CourseListPage,
  CourseDetailPage,
  SchedulePage,
  AttendanceJournalPage,
  TeacherAttendancePage,
  FinanceDeskPage,
  ExpensesPage,
  PayrollPage,
  StaffListPage,
  MarketPage,
  CoinActivityPage,
  SmsCenterPage,
  ReportsPage,
  SettingsPage,
  RolesPermissionsPage,
  BranchesPage,
} from './lazyPages'

/**
 * Sahifani route darajasidagi ruxsat tekshiruvi bilan o'raydi (ruxsat `routePermissions.ts` dan).
 * Sahifalar alohida chunk'da yuklanadi (`lazyPages.ts`); yuklanish vaqtida skeleton ko'rsatiladi.
 */
function guarded(path: string, page: ReactNode) {
  return (
    <Route
      key={path}
      path={path}
      element={
        <PermissionRoute path={path}>
          <Suspense fallback={<PageSkeleton />}>{page}</Suspense>
        </PermissionRoute>
      }
    />
  )
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
          {guarded(ROUTES.STUDENTS.RISK, <StudentRiskPage />)}
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
