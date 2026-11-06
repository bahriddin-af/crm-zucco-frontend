import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { GroupDetailPage } from './GroupDetailPage'
import { groupApi } from '../api/groupApi'
import {
  BILLING_MODE,
  DAY_SCHEDULE_TYPE,
  GROUP_STATUS,
  LESSON_STATUS,
  type GroupResponse,
  type LessonItem,
} from '../types/groupTypes'
import { studentApi } from '@/features/students/api/studentApi'
import { ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { groupsMessages } from '@/i18n/messages/groups'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('../api/groupApi', () => ({
  groupApi: { getGroupById: vi.fn(), getLessons: vi.fn(), deleteGroup: vi.fn() },
}))

vi.mock('@/features/students/api/studentApi', () => ({
  studentApi: { getStudents: vi.fn() },
}))

const en = groupsMessages.en

const group: GroupResponse = {
  id: 'group-1',
  name: 'IELTS-01',
  courseId: 'course-1',
  courseName: 'IELTS Foundation',
  teacherId: 'teacher-1',
  teacherName: 'Dilnoza Karimova',
  branchId: 'branch-1',
  branchName: 'Chilonzor',
  roomId: 'room-1',
  roomName: 'Room 3',
  daysSchedule: DAY_SCHEDULE_TYPE.OddDays,
  startTime: '09:00:00',
  endTime: '10:30:00',
  monthlyPrice: 500000,
  capacity: 12,
  enrolledStudentsCount: 8,
  status: GROUP_STATUS.Active,
  startDate: '2026-09-01',
  endDate: null,
  billingMode: BILLING_MODE.MonthlyCalendar,
  createdAt: '2026-08-20T10:00:00Z',
}

const lesson: LessonItem = {
  id: 'lesson-1',
  groupId: group.id,
  teacherId: group.teacherId,
  roomId: group.roomId,
  lessonDate: '2026-11-02',
  startTime: '09:00:00',
  endTime: '10:30:00',
  lessonNumber: 7,
  status: LESSON_STATUS.Completed,
}

const renderPage = () =>
  renderWithProviders(
    <Routes>
      <Route path={ROUTES.GROUPS.DETAIL} element={<GroupDetailPage />} />
    </Routes>,
    { route: `/groups/${group.id}` }
  )

describe('GroupDetailPage', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    useAuthStore.getState().setAuth('header.payload.signature', 'refresh', {
      id: 'u1',
      fullName: 'User',
      phone: '+998900000000',
      roles: [],
      permissions: [],
      branchIds: [],
    })
    vi.mocked(groupApi.getGroupById).mockReset().mockResolvedValue(group)
    vi.mocked(groupApi.getLessons).mockReset().mockResolvedValue([lesson])
    vi.mocked(studentApi.getStudents)
      .mockReset()
      .mockResolvedValue({
        items: [{ id: 'student-1', fullName: 'Aziz Karimov', phone: '+998901112233' }],
        totalCount: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      } as unknown as Awaited<ReturnType<typeof studentApi.getStudents>>)
  })

  it('shows group info, its students and lessons', async () => {
    renderPage()

    expect(await screen.findByRole('heading', { name: group.name })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: group.courseName })).toHaveAttribute('href', '/courses/course-1')
    expect(screen.getByText(group.teacherName)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(en.detail.openEnded))).toBeInTheDocument()
    expect(await screen.findByText('Aziz Karimov')).toBeInTheDocument()
    expect(await screen.findByText(en.lessonNumber.replace('{number}', '7'))).toBeInTheDocument()
    expect(studentApi.getStudents).toHaveBeenCalledWith(expect.objectContaining({ groupId: group.id }))
  })

  it('hides edit and delete without group permissions', async () => {
    renderPage()

    await screen.findByRole('heading', { name: group.name })
    expect(screen.queryByRole('button', { name: en.edit })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: en.delete })).not.toBeInTheDocument()
  })
})
