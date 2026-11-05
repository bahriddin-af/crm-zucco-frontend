import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLanguageStore } from '@/stores/languageStore'
import { groupsMessages } from '@/i18n/messages/groups'
import { scheduleMessages } from '@/i18n/messages/schedule'
import { LESSON_STATUS, type ScheduleLessonResponse } from '@/features/groups/types/groupTypes'
import { renderWithProviders } from '@/test/renderWithProviders'
import { scheduleApi } from '../api/scheduleApi'
import { SchedulePage } from './SchedulePage'

vi.mock('../api/scheduleApi', () => ({ scheduleApi: { getLessons: vi.fn() } }))
const { emptyPage } = vi.hoisted(() => ({
  emptyPage: { items: [], totalCount: 0, page: 1, pageSize: 100, totalPages: 0, hasPreviousPage: false, hasNextPage: false },
}))
vi.mock('@/features/groups/api/groupApi', () => ({ groupApi: { getRooms: vi.fn().mockResolvedValue(emptyPage) } }))
vi.mock('@/features/branches/api/branchApi', () => ({ branchApi: { getBranches: vi.fn().mockResolvedValue(emptyPage) } }))
vi.mock('@/features/staff/api/staffApi', () => ({ staffApi: { getList: vi.fn().mockResolvedValue(emptyPage) } }))

const en = { groups: groupsMessages.en, schedule: scheduleMessages.en }

const lessons: ScheduleLessonResponse[] = [
  {
    id: 'l1',
    groupId: 'g1',
    groupName: 'IELTS-01',
    teacherId: 't1',
    teacherName: 'Aziza Karimova',
    roomId: 'r1',
    roomName: 'Room 302',
    lessonDate: '2026-11-04',
    startTime: '14:00:00',
    endTime: '15:30:00',
    status: LESSON_STATUS.Scheduled,
  },
  {
    id: 'l2',
    groupId: 'g2',
    groupName: 'GE-04',
    teacherId: 't2',
    teacherName: 'Bekzod Aliev',
    roomId: 'r2',
    roomName: 'Room 104',
    lessonDate: '2026-11-04',
    startTime: '09:00:00',
    endTime: '10:30:00',
    status: LESSON_STATUS.Cancelled,
  },
]

function renderPage() {
  return renderWithProviders(<SchedulePage />)
}

describe('SchedulePage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 5, 10, 0))
    useLanguageStore.getState().setLanguage('en')
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('requests the current Monday–Sunday range and renders lessons in their day column', async () => {
    vi.mocked(scheduleApi.getLessons).mockResolvedValue(lessons)
    renderPage()

    await screen.findByText('IELTS-01')
    const wednesday = screen.getByRole('region', { name: en.groups.weekdaysLong[3] })
    expect(scheduleApi.getLessons).toHaveBeenCalledWith({
      from: '2026-11-02',
      to: '2026-11-08',
      branchId: undefined,
      teacherId: undefined,
      roomId: undefined,
    })

    const cards = within(wednesday).getAllByRole('article')
    expect(cards).toHaveLength(2)
    // Kun ichida vaqt bo'yicha saralangan: 09:00 darsi birinchi
    expect(within(cards[0]).getByText('GE-04')).toBeInTheDocument()
    expect(within(cards[0]).getByText(en.groups.lessonStatus[LESSON_STATUS.Cancelled])).toBeInTheDocument()
    expect(within(cards[1]).getByText('IELTS-01')).toBeInTheDocument()
    expect(within(cards[1]).getByText('Aziza Karimova')).toBeInTheDocument()
    expect(within(cards[1]).getByText('Room 302')).toBeInTheDocument()
    expect(within(cards[1]).getByText('14:00–15:30')).toBeInTheDocument()

    const monday = screen.getByRole('region', { name: en.groups.weekdaysLong[1] })
    expect(within(monday).getByText(en.schedule.noLessons)).toBeInTheDocument()
  })

  it('moves to the next week and shows the empty state when there are no lessons', async () => {
    vi.mocked(scheduleApi.getLessons).mockResolvedValueOnce(lessons).mockResolvedValue([])
    renderPage()
    await screen.findByText('IELTS-01')

    await userEvent.click(screen.getByRole('button', { name: en.schedule.nextWeek }))

    expect(await screen.findByText(en.schedule.emptyTitle)).toBeInTheDocument()
    expect(scheduleApi.getLessons).toHaveBeenLastCalledWith(expect.objectContaining({ from: '2026-11-09', to: '2026-11-15' }))
  })
})
