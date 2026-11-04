import { useState, useEffect } from 'react'
import {
  Save,
  Check,
  X,
  Clock,
  AlertTriangle,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/utils/formatters'
import { useGroupsList } from '@/features/groups/hooks/useGroups'
import {
  ATTENDANCE_STATUS,
  HOMEWORK_STATUS,
  type MarkStudentAttendanceItem,
} from '../types/attendanceTypes'
import {
  useGroupLessons,
  useLessonSheet,
  useGenerateSchedule,
  useMarkAttendance,
} from '../hooks/useAttendance'

export function AttendanceJournalPage() {
  const { data: groupsData } = useGroupsList()
  const groups = groupsData?.items || []

  const [selectedGroupId, setSelectedGroupId] = useState<string>('')
  const [selectedLessonId, setSelectedLessonId] = useState<string>('')
  const [lessonTopic, setLessonTopic] = useState<string>('')

  // Auto-select first group
  useEffect(() => {
    if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(groups[0].id)
    }
  }, [groups, selectedGroupId])

  // Lessons query for selected group
  const { data: lessons = [], isLoading: isLessonsLoading } =
    useGroupLessons(selectedGroupId)

  // Auto-select first lesson
  useEffect(() => {
    if (lessons.length > 0) {
      setSelectedLessonId(lessons[0].id)
      setLessonTopic(lessons[0].topic || '')
    } else {
      setSelectedLessonId('')
      setLessonTopic('')
    }
  }, [lessons])

  // Lesson attendance sheet
  const { data: sheet, isLoading: isSheetLoading } = useLessonSheet(selectedLessonId)

  const generateScheduleMutation = useGenerateSchedule()
  const markAttendanceMutation = useMarkAttendance()

  // Local state for interactive marking
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, MarkStudentAttendanceItem>
  >({})

  useEffect(() => {
    if (sheet?.students) {
      const initialMap: Record<string, MarkStudentAttendanceItem> = {}
      sheet.students.forEach((s) => {
        initialMap[s.studentId] = {
          studentId: s.studentId,
          status: s.status || ATTENDANCE_STATUS.Present,
          score: s.score ?? 85,
          homeworkStatus: s.homeworkStatus || HOMEWORK_STATUS.Completed,
          comment: s.comment || '',
        }
      })
      setAttendanceMap(initialMap)
      setLessonTopic(sheet.topic || '')
    }
  }, [sheet])

  const handleStatusChange = (
    studentId: string,
    status: typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS]
  ) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }))
  }

  const handleScoreChange = (studentId: string, score: number) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score,
      },
    }))
  }

  const handleSaveAttendance = () => {
    if (!selectedLessonId) return
    const items = Object.values(attendanceMap)
    markAttendanceMutation.mutate({
      lessonId: selectedLessonId,
      students: items,
      topic: lessonTopic || undefined,
    })
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Давомат журнали
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Кунлик дарс давомати, баҳолаш, уй вазифаси ва фаоллик учун тангалар
          </p>
        </div>

        {selectedLessonId && (
          <Button
            variant="primary"
            size="sm"
            isLoading={markAttendanceMutation.isPending}
            onClick={handleSaveAttendance}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Давоматни сақлаш</span>
          </Button>
        )}
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-lg border border-[#E3EAE5] shadow-xs">
        {/* Group Selector */}
        <div>
          <label className="block text-[11px] font-medium text-[#65776C] mb-1">
            Ўқув гуруҳи:
          </label>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-[#F6F8F7] px-3 py-1.5 text-xs text-[#1E2B24] font-semibold focus:outline-none focus:ring-1 focus:ring-[#146B52]"
          >
            {groups.length === 0 && <option value="">Гуруҳлар йўқ</option>}
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} — {g.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Lesson Selector */}
        <div>
          <label className="block text-[11px] font-medium text-[#65776C] mb-1">
            Дарс санаси ва тартиби:
          </label>
          {lessons.length === 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8B9C91]">Жадвал йўқ</span>
              <Button
                variant="outline"
                size="sm"
                isLoading={generateScheduleMutation.isPending}
                onClick={() => generateScheduleMutation.mutate(selectedGroupId)}
              >
                <Sparkles className="w-3 h-3" />
                <span>Жадвал яратиш</span>
              </Button>
            </div>
          ) : (
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-[#F6F8F7] px-3 py-1.5 text-xs text-[#1E2B24] font-medium focus:outline-none focus:ring-1 focus:ring-[#146B52]"
            >
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  #{l.lessonNumber} — {formatDate(l.lessonDate)} ({l.startTime.slice(0, 5)})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Lesson Topic */}
        <div>
          <label className="block text-[11px] font-medium text-[#65776C] mb-1">
            Дарс мавзуси:
          </label>
          <input
            type="text"
            placeholder="Бугунги дарс мавзуси..."
            value={lessonTopic}
            onChange={(e) => setLessonTopic(e.target.value)}
            className="w-full h-[34px] rounded-md border border-[#E3EAE5] bg-[#F6F8F7] px-3 py-1.5 text-xs text-[#1E2B24] placeholder:text-[#8B9C91] focus:outline-none focus:ring-1 focus:ring-[#146B52]"
          />
        </div>
      </div>

      {/* Skeletons */}
      {(isLessonsLoading || isSheetLoading) && (
        <div className="bg-white border border-[#E3EAE5] rounded-lg p-5 space-y-4">
          <Skeleton className="h-6 w-48" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLessonsLoading && !isSheetLoading && (!sheet || sheet.students.length === 0) && (
        <EmptyState
          title="Давомат маълумотлари йўқ"
          description={
            lessons.length === 0
              ? 'Ушбу гуруҳ учун ҳали дарс жадвали шакллантирилмаган. «Жадвал яратиш» тугмасини босинг.'
              : 'Ушбу гуруҳда ҳозирча талабалар мавжуд эмас. Гуруҳга талаба қўшинг.'
          }
          icon={<BookOpen className="w-5 h-5" />}
          action={
            lessons.length === 0 ? (
              <Button
                variant="primary"
                size="sm"
                isLoading={generateScheduleMutation.isPending}
                onClick={() => generateScheduleMutation.mutate(selectedGroupId)}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>12 та дарс жадвалини яратиш</span>
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Attendance Table */}
      {!isLessonsLoading && !isSheetLoading && sheet && sheet.students.length > 0 && (
        <div className="bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E3EAE5] flex items-center justify-between bg-[#F6F8F7]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#146B52]" />
              <span className="text-xs font-bold text-[#1E2B24]">
                {sheet.groupName} — #{sheet.lessonNumber}-дарс ({formatDate(sheet.lessonDate)})
              </span>
            </div>
            <Badge variant={sheet.isMarked ? 'success' : 'accent'}>
              {sheet.isMarked ? 'Белгиланган' : 'Кутилмоқда'}
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3EAE5] text-[11px] font-semibold text-[#65776C] uppercase">
                  <th className="py-3 px-4">Талаба</th>
                  <th className="py-3 px-4">Давомат ҳолати</th>
                  <th className="py-3 px-4">Баҳо (0 - 100)</th>
                  <th className="py-3 px-4">Уй вазифаси</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F1] text-xs">
                {sheet.students.map((student) => {
                  const currentItem = attendanceMap[student.studentId] || {
                    status: ATTENDANCE_STATUS.Present,
                    score: 85,
                  }

                  return (
                    <tr key={student.studentId} className="hover:bg-[#F9FBFA]">
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#1E2B24]">{student.studentName}</p>
                        <p className="text-[11px] text-[#65776C]">{student.phone}</p>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(student.studentId, ATTENDANCE_STATUS.Present)
                            }
                            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                              currentItem.status === ATTENDANCE_STATUS.Present
                                ? 'bg-[#047857] text-white'
                                : 'bg-[#F0FDF4] text-[#047857] hover:bg-[#DCFCE7]'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Келди</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(student.studentId, ATTENDANCE_STATUS.Late)
                            }
                            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                              currentItem.status === ATTENDANCE_STATUS.Late
                                ? 'bg-[#D97706] text-white'
                                : 'bg-[#FFFBEB] text-[#D97706] hover:bg-[#FEF3C7]'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Кечикди</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(student.studentId, ATTENDANCE_STATUS.Excused)
                            }
                            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                              currentItem.status === ATTENDANCE_STATUS.Excused
                                ? 'bg-[#4B5563] text-white'
                                : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]'
                            }`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Сабабли</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(student.studentId, ATTENDANCE_STATUS.Unexcused)
                            }
                            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                              currentItem.status === ATTENDANCE_STATUS.Unexcused
                                ? 'bg-[#BE123C] text-white'
                                : 'bg-[#FFF1F2] text-[#BE123C] hover:bg-[#FFE4E6]'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Келмади</span>
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={currentItem.score ?? 85}
                          onChange={(e) =>
                            handleScoreChange(student.studentId, Number(e.target.value))
                          }
                          className="w-16 h-8 text-center rounded border border-[#E3EAE5] bg-[#F6F8F7] font-bold text-xs focus:outline-none focus:ring-1 focus:ring-[#146B52]"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium text-[#146B52] bg-[#E8F3ED] px-2 py-0.5 rounded">
                          Бажарилди
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
