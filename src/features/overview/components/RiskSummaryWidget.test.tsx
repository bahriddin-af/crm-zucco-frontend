import { screen } from '@testing-library/react'
import { RiskSummaryWidget } from './RiskSummaryWidget'
import { studentRiskApi } from '@/features/students/api/studentRiskApi'
import { RISK_LEVEL } from '@/features/students/types/studentRiskTypes'
import { useLanguageStore } from '@/stores/languageStore'
import { riskMessages } from '@/i18n/messages/risk'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/features/students/api/studentRiskApi', () => ({
  studentRiskApi: { getRiskSummary: vi.fn() },
}))

const text = riskMessages.en

describe('RiskSummaryWidget', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    vi.mocked(studentRiskApi.getRiskSummary).mockReset()
  })

  it('shows the count per level, each linking to the filtered list', async () => {
    vi.mocked(studentRiskApi.getRiskSummary).mockResolvedValue({
      snapshotDate: '2026-11-06',
      total: 20,
      low: 12,
      medium: 5,
      high: 3,
    })
    renderWithProviders(<RiskSummaryWidget />)

    const high = await screen.findByRole('link', { name: new RegExp(`^3\\s*${text.levels[RISK_LEVEL.High]}$`) })
    expect(high).toHaveAttribute('href', '/students/risk?level=3')
    expect(screen.getByRole('link', { name: new RegExp(`^12\\s*${text.levels[RISK_LEVEL.Low]}$`) })).toHaveAttribute(
      'href',
      '/students/risk?level=1'
    )
    expect(screen.getByText('20 students evaluated')).toBeInTheDocument()
  })

  it('says when there is no calculation yet', async () => {
    vi.mocked(studentRiskApi.getRiskSummary).mockResolvedValue({ snapshotDate: null, total: 0, low: 0, medium: 0, high: 0 })
    renderWithProviders(<RiskSummaryWidget />)

    expect(await screen.findByText(text.widget.noSnapshot)).toBeInTheDocument()
  })
})
