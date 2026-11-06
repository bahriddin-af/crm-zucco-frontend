import { screen } from '@testing-library/react'
import { StudentRiskCard } from './StudentRiskCard'
import { studentRiskApi } from '../../api/studentRiskApi'
import { RISK_LEVEL, RISK_REASON } from '../../types/studentRiskTypes'
import { useLanguageStore } from '@/stores/languageStore'
import { riskMessages } from '@/i18n/messages/risk'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('../../api/studentRiskApi', () => ({
  studentRiskApi: { getRiskHistory: vi.fn() },
}))

const text = riskMessages.en

describe('StudentRiskCard', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    vi.mocked(studentRiskApi.getRiskHistory).mockReset()
  })

  it('shows the latest score, level, reasons and a 30-day chart', async () => {
    vi.mocked(studentRiskApi.getRiskHistory).mockResolvedValue([
      { date: '2026-11-05', score: 20, level: RISK_LEVEL.Low, reasons: [RISK_REASON.Debt] },
      { date: '2026-11-06', score: 45, level: RISK_LEVEL.Medium, reasons: [RISK_REASON.Debt, RISK_REASON.AbsenceStreak] },
    ])
    renderWithProviders(<StudentRiskCard studentId="student-1" />)

    expect(await screen.findByText('45/100')).toBeInTheDocument()
    expect(screen.getByText(text.levels[RISK_LEVEL.Medium])).toBeInTheDocument()
    expect(screen.getByText(text.reasonLabels[RISK_REASON.AbsenceStreak])).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Risk score over the last 30 days' })).toBeInTheDocument()
    expect(studentRiskApi.getRiskHistory).toHaveBeenCalledWith('student-1', 30)
  })

  it('says when the student has not been evaluated', async () => {
    vi.mocked(studentRiskApi.getRiskHistory).mockResolvedValue([])
    renderWithProviders(<StudentRiskCard studentId="student-1" />)

    expect(await screen.findByText(text.profile.noHistory)).toBeInTheDocument()
  })
})
