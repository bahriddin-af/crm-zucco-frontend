import { act, renderHook, waitFor } from '@testing-library/react'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { createQueryWrapper, createTestQueryClient } from '@/test/renderWithProviders'
import { attendanceApi } from '../api/attendanceApi'
import {
  ATTENDANCE_STATUS,
  HOMEWORK_STATUS,
  type LessonAttendanceSheetResponse,
  type MarkLessonAttendanceRequest,
} from '../types/attendanceTypes'
import { useMarkAttendance } from './useAttendance'

vi.mock('../api/attendanceApi', () => ({
  attendanceApi: { markAttendance: vi.fn(), getLessonSheet: vi.fn() },
}))

const LESSON_ID = 'lesson-1'
const sheetKey = QUERY_KEYS.ATTENDANCE.LESSON(LESSON_ID)

const sheet: LessonAttendanceSheetResponse = {
  lessonId: LESSON_ID,
  groupId: 'group-1',
  groupName: 'IELTS-01',
  lessonDate: '2026-11-02',
  startTime: '14:00:00',
  endTime: '15:30:00',
  lessonNumber: 3,
  topic: null,
  isMarked: false,
  students: [
    { studentId: 's1', studentName: 'Ali', phone: '998901112233', status: null, score: null, homeworkStatus: null },
    { studentId: 's2', studentName: 'Vali', phone: '998901112244', status: null, score: null, homeworkStatus: null },
  ],
}

const markAbsent: MarkLessonAttendanceRequest = {
  lessonId: LESSON_ID,
  students: [{ studentId: 's1', status: ATTENDANCE_STATUS.Unexcused, homeworkStatus: HOMEWORK_STATUS.NotDone }],
}

function setup() {
  const client = createTestQueryClient()
  client.setQueryData(sheetKey, sheet)
  const { result } = renderHook(() => useMarkAttendance(), { wrapper: createQueryWrapper(client) })
  const readSheet = () => client.getQueryData<LessonAttendanceSheetResponse>(sheetKey)
  return { result, readSheet }
}

/** Testda qo'lda boshqariladigan promise: server javobini kutib turgan holatni tekshirish uchun. */
function deferred<T>() {
  let resolve: (value: T) => void = () => undefined
  let reject: (reason: unknown) => void = () => undefined
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('useMarkAttendance (optimistic update)', () => {
  beforeEach(() => {
    vi.mocked(attendanceApi.getLessonSheet).mockResolvedValue(sheet)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('applies the mark to the cached sheet before the server answers', async () => {
    const pending = deferred<LessonAttendanceSheetResponse>()
    vi.mocked(attendanceApi.markAttendance).mockReturnValue(pending.promise)
    const { result, readSheet } = setup()

    act(() => result.current.mutate(markAbsent))

    await waitFor(() => expect(readSheet()?.students[0].status).toBe(ATTENDANCE_STATUS.Unexcused))
    expect(readSheet()?.students[0].homeworkStatus).toBe(HOMEWORK_STATUS.NotDone)
    expect(readSheet()?.students[1].status).toBeNull()
    expect(readSheet()?.isMarked).toBe(true)
    expect(result.current.isPending).toBe(true)
    expect(attendanceApi.markAttendance).toHaveBeenCalledWith(markAbsent)

    await act(async () => pending.resolve(sheet))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('rolls the sheet back to the snapshot when the request fails', async () => {
    const pending = deferred<LessonAttendanceSheetResponse>()
    vi.mocked(attendanceApi.markAttendance).mockReturnValue(pending.promise)
    const { result, readSheet } = setup()

    act(() => result.current.mutate(markAbsent))
    await waitFor(() => expect(readSheet()?.students[0].status).toBe(ATTENDANCE_STATUS.Unexcused))

    await act(async () => pending.reject(new Error('server error')))

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(readSheet()).toEqual(sheet)
  })
})
