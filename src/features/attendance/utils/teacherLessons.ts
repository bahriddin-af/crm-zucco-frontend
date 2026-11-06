import { LESSON_STATUS, type ScheduleLessonResponse } from '@/features/groups/types/groupTypes'

/** O'qituvchi sahifasida bugun bilan birga ko'rsatiladigan oldingi kunlar soni (jami 7 kun). */
export const TEACHER_LESSONS_LOOKBACK_DAYS = 6

/**
 * Standart tanlov: bugungi yoki eng oxirgi o'tgan, bekor qilinmagan dars.
 * Ro'yxat backend'dan sana/vaqt bo'yicha o'sish tartibida keladi.
 */
export function pickTeacherDefaultLesson(
  lessons: readonly ScheduleLessonResponse[],
  today: string
): ScheduleLessonResponse | undefined {
  const candidates = lessons.filter(
    (lesson) => lesson.lessonDate <= today && lesson.status !== LESSON_STATUS.Cancelled
  )
  return candidates[candidates.length - 1] ?? lessons[lessons.length - 1]
}
