import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeadDetailModal } from './LeadDetailModal'
import { leadApi } from '../api/leadApi'
import { LEAD_STATUS, LOST_REASON, type LeadResponse } from '../types/leadTypes'
import { PERMISSIONS, type Permission } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { leadsMessages } from '@/i18n/messages/leads'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('../api/leadApi', () => ({
  leadApi: { getLeadById: vi.fn(), archiveLead: vi.fn() },
}))

const text = leadsMessages.en.detail

const lead: LeadResponse = {
  id: 'lead-1',
  fullName: 'Aziz Karimov',
  phone: '+998901112233',
  stageId: 'stage-1',
  stageName: 'New',
  status: LEAD_STATUS.Active,
  createdAt: '2026-11-01T10:00:00Z',
  lostReason: LOST_REASON.None,
  activities: [],
}

function signIn(permissions: Permission[]) {
  useAuthStore.getState().setAuth('a.b.c', 'refresh', {
    id: 'user-1',
    fullName: 'Manager',
    phone: '+998900000000',
    roles: [],
    permissions,
    branchIds: [],
  })
}

describe('LeadDetailModal archive', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    vi.mocked(leadApi.getLeadById).mockReset().mockResolvedValue(lead)
    vi.mocked(leadApi.archiveLead).mockReset().mockResolvedValue({ success: true, code: 'lead_archived', data: null })
  })

  it('archives only after confirmation and then closes', async () => {
    signIn([PERMISSIONS.LEADS.VIEW, PERMISSIONS.LEADS.DELETE])
    const onClose = vi.fn()
    renderWithProviders(<LeadDetailModal leadId={lead.id} onClose={onClose} onEdit={vi.fn()} />)

    await userEvent.click(await screen.findByRole('button', { name: text.archive }))
    expect(leadApi.archiveLead).not.toHaveBeenCalled()

    const confirmText = text.archiveConfirm.replace('{name}', lead.fullName)
    expect(await screen.findByText(confirmText)).toBeInTheDocument()
    const archiveButtons = screen.getAllByRole('button', { name: text.archive })
    await userEvent.click(archiveButtons[archiveButtons.length - 1])

    await waitFor(() => expect(leadApi.archiveLead).toHaveBeenCalledWith(lead.id))
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('hides archiving without leads.delete', async () => {
    signIn([PERMISSIONS.LEADS.VIEW])
    renderWithProviders(<LeadDetailModal leadId={lead.id} onClose={vi.fn()} onEdit={vi.fn()} />)

    await screen.findByText(lead.stageName)
    expect(screen.queryByRole('button', { name: text.archive })).not.toBeInTheDocument()
  })
})
