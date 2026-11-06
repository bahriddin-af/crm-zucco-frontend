import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeadsTable } from './LeadsTable'
import { leadApi } from '../api/leadApi'
import { LEAD_STATUS, LEADS_PAGE_SIZE, type LeadListItem } from '../types/leadTypes'
import { useLanguageStore } from '@/stores/languageStore'
import { leadsMessages } from '@/i18n/messages/leads'
import { uiMessages } from '@/i18n/messages/ui'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('../api/leadApi', () => ({
  leadApi: { getLeads: vi.fn() },
}))

const en = leadsMessages.en

const lead: LeadListItem = {
  id: 'lead-1',
  fullName: 'Aziz Karimov',
  phone: '+998901112233',
  courseName: 'IELTS',
  sourceName: 'Instagram',
  stageId: 'stage-1',
  stageName: 'New',
  status: LEAD_STATUS.Lost,
  createdAt: '2026-11-01T10:00:00Z',
}

const pagedResult = (page: number) => ({
  items: [lead],
  totalCount: 25,
  page,
  pageSize: LEADS_PAGE_SIZE,
  totalPages: 2,
  hasPreviousPage: page > 1,
  hasNextPage: page < 2,
})

describe('LeadsTable', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    vi.mocked(leadApi.getLeads)
      .mockReset()
      .mockImplementation(async (filters) => pagedResult(filters?.page ?? 1))
  })

  it('lists leads of every status and opens the clicked lead', async () => {
    const onOpen = vi.fn()
    renderWithProviders(<LeadsTable search="" courseId="" onOpen={onOpen} />)

    await userEvent.click(await screen.findByRole('button', { name: lead.fullName }))
    expect(onOpen).toHaveBeenCalledWith(lead)
    expect(screen.getByText(en.statuses[LEAD_STATUS.Lost])).toBeInTheDocument()
    expect(screen.getByText(en.table.total.replace('{count}', '25'))).toBeInTheDocument()
  })

  it('requests the next page from the server', async () => {
    renderWithProviders(<LeadsTable search="" courseId="course-1" onOpen={vi.fn()} />)

    await userEvent.click(await screen.findByRole('button', { name: uiMessages.en.nextPage }))
    await waitFor(() =>
      expect(leadApi.getLeads).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2, pageSize: LEADS_PAGE_SIZE, courseId: 'course-1' })
      )
    )
  })
})
