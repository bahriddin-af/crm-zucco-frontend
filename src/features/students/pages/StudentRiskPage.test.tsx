import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudentRiskPage } from './StudentRiskPage'
import { studentRiskApi } from '../api/studentRiskApi'
import { RISK_LEVEL, RISK_REASON, type StudentRiskItem, type StudentRiskSummary } from '../types/studentRiskTypes'
import { STUDENT_STATUS } from '../types/studentTypes'
import { PERMISSIONS, type Permission } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { riskMessages } from '@/i18n/messages/risk'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ROUTES } from '@/routes/paths'

vi.mock('../api/studentRiskApi', () => ({
  studentRiskApi: { getRiskList: vi.fn(), getRiskSummary: vi.fn(), recalculate: vi.fn() },
}))

const text = riskMessages.en

const item: StudentRiskItem = {
  studentId: 'student-1',
  fullName: 'Aziz Karimov',
  phone: '+998901112233',
  status: STUDENT_STATUS.Debtor,
  balance: -1200000,
  score: 75,
  level: RISK_LEVEL.High,
  reasons: [RISK_REASON.FrequentAbsences, RISK_REASON.HighDebt],
  metrics: {
    unexcusedAbsences: 4,
    lateArrivals: 0,
    absenceStreak: 1,
    gradeDropPercent: null,
    debtMonths: 2,
    noRecentCoins: false,
    daysSinceFreezeEnded: null,
  },
  snapshotDate: '2026-11-06',
}

const summary: StudentRiskSummary = { snapshotDate: '2026-11-06', total: 10, low: 6, medium: 3, high: 1 }

const paged = (items: StudentRiskItem[]) => ({
  items,
  totalCount: items.length,
  page: 1,
  pageSize: 20,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
})

const signIn = (permissions: Permission[]) =>
  useAuthStore.getState().setAuth('a.b.c', 'refresh', {
    id: 'user-1',
    fullName: 'Admin',
    phone: '+998900000000',
    roles: [],
    permissions,
    branchIds: [],
  })

describe('StudentRiskPage', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    signIn([PERMISSIONS.STUDENTS.RISK_VIEW])
    vi.mocked(studentRiskApi.getRiskSummary).mockReset().mockResolvedValue(summary)
    vi.mocked(studentRiskApi.getRiskList).mockReset().mockResolvedValue(paged([item]))
    vi.mocked(studentRiskApi.recalculate).mockReset().mockResolvedValue({ snapshotDate: '2026-11-06', evaluated: 10 })
  })

  it('lists students with their level and reasons written as sentences', async () => {
    renderWithProviders(<StudentRiskPage />, { route: ROUTES.STUDENTS.RISK })

    expect(await screen.findByRole('link', { name: item.fullName })).toHaveAttribute('href', '/students/student-1')
    expect(within(screen.getByRole('table')).getByText(text.levels[RISK_LEVEL.High])).toBeInTheDocument()
    expect(screen.getByText('4 unexcused absences in the last 14 days')).toBeInTheDocument()
    expect(screen.getByText('2 months of debt (high)')).toBeInTheDocument()
  })

  it('applies the level from the URL (dashboard widget link)', async () => {
    renderWithProviders(<StudentRiskPage />, { route: `${ROUTES.STUDENTS.RISK}?level=3` })

    await waitFor(() =>
      expect(studentRiskApi.getRiskList).toHaveBeenCalledWith(expect.objectContaining({ level: RISK_LEVEL.High, page: 1 }))
    )
    expect(screen.getByRole('tab', { name: text.levels[RISK_LEVEL.High] })).toHaveAttribute('aria-selected', 'true')
  })

  it('explains that nothing has been calculated yet', async () => {
    vi.mocked(studentRiskApi.getRiskSummary).mockResolvedValue({ ...summary, snapshotDate: null })
    renderWithProviders(<StudentRiskPage />, { route: ROUTES.STUDENTS.RISK })

    expect(await screen.findByText(text.noSnapshotTitle)).toBeInTheDocument()
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })

  it('hides recalculation without the permission', async () => {
    renderWithProviders(<StudentRiskPage />, { route: ROUTES.STUDENTS.RISK })

    await screen.findByText(item.fullName)
    expect(screen.queryByRole('button', { name: text.recalculate })).not.toBeInTheDocument()
  })

  it('recalculates only after confirmation', async () => {
    signIn([PERMISSIONS.STUDENTS.RISK_VIEW, PERMISSIONS.STUDENTS.RISK_RECALCULATE])
    renderWithProviders(<StudentRiskPage />, { route: ROUTES.STUDENTS.RISK })

    await userEvent.click(await screen.findByRole('button', { name: text.recalculate }))
    expect(studentRiskApi.recalculate).not.toHaveBeenCalled()
    expect(screen.getByText(text.recalculateConfirm)).toBeInTheDocument()

    const buttons = screen.getAllByRole('button', { name: text.recalculate })
    await userEvent.click(buttons[buttons.length - 1])
    await waitFor(() => expect(studentRiskApi.recalculate).toHaveBeenCalledTimes(1))
  })
})
