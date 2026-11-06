import { screen } from '@testing-library/react'
import { StudentAttendanceHistory } from './StudentAttendanceHistory'
import { attendanceApi } from '../api/attendanceApi'
import { ATTENDANCE_STATUS, HOMEWORK_STATUS } from '../types/attendanceTypes'
import { useLanguageStore } from '@/stores/languageStore'
import { attendanceMessages } from '@/i18n/messages/attendance'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('../api/attendanceApi', () => ({
  attendanceApi: { getStudentHistory: vi.fn() },
}))

const en = attendanceMessages.en

describe('StudentAttendanceHistory', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    vi.mocked(attendanceApi.getStudentHistory).mockReset()
  })

  it('shows each marked lesson with status, score and homework', async () => {
    vi.mocked(attendanceApi.getStudentHistory).mockResolvedValue([
      {
        lessonId: 'lesson-1',
        lessonDate: '2026-11-02',
        groupName: 'IELTS-01',
        lessonNumber: 7,
        status: ATTENDANCE_STATUS.Late,
        score: 85,
        homeworkStatus: HOMEWORK_STATUS.Partial,
        comment: null,
        markedAt: '2026-11-02T11:00:00Z',
      },
    ])
    renderWithProviders(<StudentAttendanceHistory studentId="student-1" />)

    expect(await screen.findByText('IELTS-01')).toBeInTheDocument()
    expect(screen.getByText(en.statuses[ATTENDANCE_STATUS.Late])).toBeInTheDocument()
    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText(en.homeworkStatuses[HOMEWORK_STATUS.Partial])).toBeInTheDocument()
    expect(attendanceApi.getStudentHistory).toHaveBeenCalledWith('student-1')
  })

  it('shows the empty state when nothing was marked', async () => {
    vi.mocked(attendanceApi.getStudentHistory).mockResolvedValue([])
    renderWithProviders(<StudentAttendanceHistory studentId="student-1" />)

    expect(await screen.findByText(en.history.emptyTitle)).toBeInTheDocument()
  })
})
