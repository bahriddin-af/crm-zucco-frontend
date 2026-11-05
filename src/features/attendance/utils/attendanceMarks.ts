import { LESSON_STATUS, type LessonItem } from '@/features/groups/types/groupTypes'
import {
  ATTENDANCE_STATUS,
  HOMEWORK_STATUS,
  type LessonAttendanceSheetResponse,
  type MarkLessonAttendanceRequest,
  type MarkStudentAttendanceItem,
  type StudentAttendanceSheetItem,
} from '../types/attendanceTypes'

/** Optimistik yangilash: so'rovdagi belgilarni keshdagi varaqqa darhol qo'llaydi (sof funksiya). */
export function applyAttendanceMarks(
  sheet: LessonAttendanceSheetResponse,
  request: MarkLessonAttendanceRequest
): LessonAttendanceSheetResponse {
  const marks = new Map(request.students.map((item) => [item.studentId, item]))
  const topic = request.topic?.trim()

  return {
    ...sheet,
    isMarked: true,
    topic: topic ? topic : sheet.topic,
    students: sheet.students.map((student) => {
      const mark = marks.get(student.studentId)
      if (!mark) return student
      return {
        ...student,
        status: mark.status,
        score: mark.score ?? null,
        homeworkStatus: mark.homeworkStatus,
        comment: mark.comment ?? null,
      }
    }),
  }
}

interface MarkOverrides {
  status?: MarkStudentAttendanceItem['status']
  score?: number | null
  homeworkStatus?: MarkStudentAttendanceItem['homeworkStatus']
}

/**
 * Varaq qatoridan backend'ga yuboriladigan belgini quradi. Belgilanmagan talaba "Keldi" deb olinadi.
 * Baho faqat `canGrade` bo'lsa yuboriladi: aks holda backend `attendance.grade` ruxsatini talab qiladi.
 */
export function buildStudentMark(
  student: StudentAttendanceSheetItem,
  canGrade: boolean,
  overrides: MarkOverrides = {}
): MarkStudentAttendanceItem {
  const score = 'score' in overrides ? overrides.score : student.score
  return {
    studentId: student.studentId,
    status: overrides.status ?? student.status ?? ATTENDANCE_STATUS.Present,
    homeworkStatus: overrides.homeworkStatus ?? student.homeworkStatus ?? HOMEWORK_STATUS.Completed,
    score: canGrade ? (score ?? null) : null,
    comment: student.comment ?? null,
  }
}

/** Backend: bekor qilingan yoki kelajakdagi dars uchun davomat qabul qilinmaydi. */
export function isLessonMarkable(lesson: Pick<LessonItem, 'status' | 'lessonDate'>, today: string): boolean {
  return lesson.status !== LESSON_STATUS.Cancelled && lesson.lessonDate <= today
}

/** Standart dars: bugungi yoki eng oxirgi o'tgan bekor qilinmagan dars, bo'lmasa birinchisi. */
export function pickDefaultLesson(lessons: readonly LessonItem[], today: string): LessonItem | undefined {
  const markable = lessons.filter((lesson) => isLessonMarkable(lesson, today))
  return markable[markable.length - 1] ?? lessons[0]
}
