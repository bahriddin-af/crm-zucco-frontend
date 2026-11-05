import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeadConvertModal } from './LeadConvertModal'
import { leadApi } from '../api/leadApi'
import { LEAD_STATUS, type LeadListItem } from '../types/leadTypes'
import { useGroupsList } from '@/features/groups/hooks/useGroups'
import { GROUP_STATUS } from '@/features/groups/types/groupTypes'
import { useLanguageStore } from '@/stores/languageStore'
import { leadsMessages } from '@/i18n/messages/leads'
import { commonMessages } from '@/i18n/messages/common'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('../api/leadApi', () => ({
  leadApi: { convertLead: vi.fn() },
}))

vi.mock('@/features/groups/hooks/useGroups', () => ({
  useGroupsList: vi.fn(),
}))

const en = leadsMessages.en

const lead: LeadListItem = {
  id: 'lead-1',
  fullName: 'Aziz Karimov',
  phone: '+998901112233',
  stageId: 'stage-1',
  stageName: 'New',
  status: LEAD_STATUS.Active,
  courseName: 'IELTS',
  createdAt: '2026-11-01T10:00:00Z',
}

const groups = [
  { id: 'group-1', name: 'IELTS-1', courseName: 'IELTS', teacherName: 'Teacher A', status: GROUP_STATUS.Active },
  { id: 'group-old', name: 'OLD', courseName: 'IELTS', teacherName: 'Teacher B', status: GROUP_STATUS.Completed },
]

const renderModal = (onClose = vi.fn()) => {
  renderWithProviders(<LeadConvertModal lead={lead} onClose={onClose} />)
  return { onClose }
}

describe('LeadConvertModal', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    vi.mocked(leadApi.convertLead).mockReset().mockResolvedValue({ leadId: lead.id, studentId: 'student-1' })
    vi.mocked(useGroupsList).mockReturnValue({ data: { items: groups } } as unknown as ReturnType<typeof useGroupsList>)
  })

  it('offers only non-completed groups', () => {
    renderModal()
    expect(screen.getByRole('option', { name: /IELTS-1/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /OLD/ })).not.toBeInTheDocument()
  })

  it('requires a join date when a group is selected', async () => {
    renderModal()
    await userEvent.selectOptions(screen.getByLabelText(en.convert.group), 'group-1')
    fireEvent.change(screen.getByLabelText(en.convert.joinedDate), { target: { value: '' } })
    await userEvent.click(screen.getByRole('button', { name: en.convert.submit }))

    expect(await screen.findByText(commonMessages.en.requiredField)).toBeInTheDocument()
    expect(leadApi.convertLead).not.toHaveBeenCalled()
  })

  it('submits the converted payload with the selected group and closes', async () => {
    const { onClose } = renderModal()
    await userEvent.selectOptions(screen.getByLabelText(en.convert.group), 'group-1')
    fireEvent.change(screen.getByLabelText(en.convert.joinedDate), { target: { value: '2026-11-10' } })
    await userEvent.click(screen.getByRole('button', { name: en.convert.submit }))

    await waitFor(() =>
      expect(leadApi.convertLead).toHaveBeenCalledWith({
        leadId: 'lead-1',
        groupId: 'group-1',
        joinedDate: '2026-11-10',
      })
    )
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('converts without a group by sending null group and date', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: en.convert.submit }))

    await waitFor(() =>
      expect(leadApi.convertLead).toHaveBeenCalledWith({ leadId: 'lead-1', groupId: null, joinedDate: null })
    )
  })
})
