import { screen } from '@testing-library/react'
import { PERMISSIONS, ROLES } from '@/constants/permissions'
import { getTranslations, interpolate } from '@/i18n'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { formatCurrency } from '@/utils/formatters'
import { PAYMENT_METHOD } from '@/features/finance/types/financeTypes'
import { renderWithProviders } from '@/test/renderWithProviders'
import { reportsApi } from '../api/reportsApi'
import type { MonthlyReportResponse } from '../types/reportTypes'
import { ReportsPage } from './ReportsPage'

vi.mock('../api/reportsApi', () => ({
  reportsApi: { getMonthly: vi.fn() },
}))

const t = getTranslations('en')
/** Testing Library matnni normallashtiradi (NBSP → oddiy bo'shliq), kutilgan qiymat ham shunday bo'lishi kerak. */
const money = (value: number) => formatCurrency(value).replace(/\s+/g, ' ')

const REPORT: MonthlyReportResponse = {
  period: '2026-11',
  revenue: 42_000_000,
  expenses: 15_600_000,
  netProfit: 26_400_000,
  previousNetProfit: 22_000_000,
  newStudents: 34,
  newLeads: 50,
  convertedLeads: 34,
  conversionRatePercent: 68,
  totalDebt: 5_600_000,
  debtorsCount: 14,
  revenueByMethod: [
    { method: PAYMENT_METHOD.Cash, amount: 30_000_000 },
    { method: PAYMENT_METHOD.Payme, amount: 12_000_000 },
  ],
  expensesByCategory: [{ categoryId: 'rent', categoryName: 'Office rent', amount: 9_000_000 }],
  trend: [
    { period: '2026-10', revenue: 38_000_000, expenses: 16_000_000 },
    { period: '2026-11', revenue: 42_000_000, expenses: 15_600_000 },
  ],
}

function renderPage(permissions: string[]) {
  useAuthStore.getState().setAuth('token', 'refresh', {
    id: 'u1',
    fullName: 'User',
    phone: '+998900000000',
    roles: [ROLES.CASHIER],
    permissions,
    branchIds: [],
  })
  return renderWithProviders(<ReportsPage />)
}

describe('ReportsPage', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    vi.mocked(reportsApi.getMonthly).mockReset().mockResolvedValue(REPORT)
  })

  it('renders KPIs, breakdowns and trend from the monthly report', async () => {
    renderPage([PERMISSIONS.FINANCE.VIEW])

    expect(await screen.findByText(money(REPORT.netProfit))).toBeInTheDocument()
    expect(reportsApi.getMonthly).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}$/))

    expect(screen.getAllByText(money(REPORT.revenue)).length).toBeGreaterThan(0)
    expect(screen.getByText(money(REPORT.totalDebt))).toBeInTheDocument()
    expect(screen.getByText('34')).toBeInTheDocument()
    expect(screen.getByText(interpolate(t.reports.debtors, { count: 14 }))).toBeInTheDocument()
    expect(screen.getByText(/\+20%/)).toBeInTheDocument()

    expect(screen.getByText(t.finance.paymentMethods[PAYMENT_METHOD.Cash])).toBeInTheDocument()
    expect(screen.getByText(t.finance.paymentMethods[PAYMENT_METHOD.Payme])).toBeInTheDocument()
    expect(screen.getByText('Office rent')).toBeInTheDocument()
    expect(screen.getByText('2026-10')).toBeInTheDocument()
  })

  it('shows a no-access state without finance.view', () => {
    renderPage([PERMISSIONS.ATTENDANCE.MARK])

    expect(screen.getByText(t.reports.noAccessTitle)).toBeInTheDocument()
    expect(reportsApi.getMonthly).not.toHaveBeenCalled()
  })
})
