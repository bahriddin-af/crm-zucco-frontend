import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { interpolate, useTranslation } from '@/i18n'
import { formatDate } from '@/utils/formatters'
import { parseIsoDate, shortTime } from '@/utils/dateUtils'
import type { ScheduleLessonResponse } from '@/features/groups/types/groupTypes'

interface TeacherLessonSelectProps {
  lessons: ScheduleLessonResponse[]
  lessonId: string
  onChange: (lessonId: string) => void
}

export function TeacherLessonSelect({ lessons, lessonId, onChange }: TeacherLessonSelectProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-surface p-3.5 rounded-lg border border-border shadow-xs">
      <FormField label={t.attendance.teacher.lessonsTitle} htmlFor="teacher-lesson">
        <SelectInput id="teacher-lesson" value={lessonId} onChange={(event) => onChange(event.target.value)}>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {interpolate(t.attendance.teacher.lessonOption, {
                group: lesson.groupName,
                date: formatDate(parseIsoDate(lesson.lessonDate)),
                time: shortTime(lesson.startTime),
              })}
              {' — '}
              {t.groups.lessonStatus[lesson.status]}
            </option>
          ))}
        </SelectInput>
      </FormField>
    </div>
  )
}
