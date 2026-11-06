import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudentListPage } from './StudentListPage'
import { studentApi } from '../api/studentApi'
import { STUDENT_STATUS, type StudentListItem } from '../types/studentTypes'
import { useBranchOptions } from '@/features/branches/hooks/useBranches'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { studentsMessages } from '@/i18n/messages/students'
import { layoutMessages } from '@/i18n/messages/layout'
import { errorsMessages } from '@/i18n/messages/errors'
import { createApiError, renderWithProviders } from '@/test/renderWithProviders'
import { HTTP_STATUS } from '@/constants/http'

vi.mock('../api/studentApi', () => ({
  studentApi: { getStudents: vi.fn() },
}))

vi.mock('@/features/branches/hooks/useBranches', () => ({
  useBranchOptions: vi.fn(),
}))

const BRANCH_ID = 'branch-2'

const student: StudentListItem = {
  id: 'student-1',
  fullName: 'Aziz Karimov',
  phone: '+998901112233',
  status: STUDENT_STATUS.Active,
  balance: 0,
  coinsBalance: 5,
  primaryGroup: { groupId: 'group-1', groupName: 'IELTS 7.0', branchId: BRANCH_ID, branchName: 'Yunusobod' },
  createdAt: '2026-11-01T10:00:00Z',
}

const pagedResult = (items: StudentListItem[]) => ({
  items,
  totalCount: items.length,
  page: 1,
  pageSize: 20,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
})

describe('StudentListPage branch filter', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en')
    useAuthStore.getState().setAuth('a.b.c', 'refresh', {
      id: 'user-1',
      fullName: 'Admin',
      phone: '+998900000000',
      roles: [],
      permissions: [PERMISSIONS.STUDENTS.VIEW, PERMISSIONS.BRANCHES.VIEW],
      branchIds: [],
    })
    vi.mocked(useBranchOptions).mockReturnValue({
      data: [
        { id: 'branch-1', name: 'Chilonzor' },
        { id: BRANCH_ID, name: 'Yunusobod' },
      ],
    } as unknown as ReturnType<typeof useBranchOptions>)
    vi.mocked(studentApi.getStudents).mockReset().mockResolvedValue(pagedResult([student]))
  })

  it('shows the primary group with its branch and links to the group', async () => {
    renderWithProviders(<StudentListPage />)

    const groupLink = await screen.findByRole('link', { name: 'IELTS 7.0' })
    expect(groupLink).toHaveAttribute('href', '/groups/group-1')
    expect(screen.getAllByText('Yunusobod').length).toBeGreaterThan(0)
  })

  it('sends the selected branch to the server and resets to the first page', async () => {
    renderWithProviders(<StudentListPage />)
    await screen.findByText(student.fullName)

    await userEvent.selectOptions(screen.getByLabelText(layoutMessages.en.branchLabel), BRANCH_ID)

    await waitFor(() =>
      expect(studentApi.getStudents).toHaveBeenLastCalledWith(expect.objectContaining({ branchId: BRANCH_ID, page: 1 }))
    )
  })

  it('shows "no group" when the student has no current enrollment', async () => {
    vi.mocked(studentApi.getStudents).mockResolvedValue(pagedResult([{ ...student, primaryGroup: null }]))
    renderWithProviders(<StudentListPage />)

    expect(await screen.findByText(studentsMessages.en.noGroup)).toBeInTheDocument()
  })

  it('explains a forbidden branch instead of a generic error', async () => {
    vi.mocked(studentApi.getStudents).mockRejectedValue(createApiError(HTTP_STATUS.FORBIDDEN, 'branch_access_denied'))
    renderWithProviders(<StudentListPage />)

    expect(await screen.findByText(errorsMessages.en.branch_access_denied)).toBeInTheDocument()
  })
})
