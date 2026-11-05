import { interpolate, useTranslation } from '@/i18n'
import { formatDate } from '@/utils/formatters'
import type { GroupListItem, LessonItem } from '@/features/groups/types/groupTypes'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { parseIsoDate, shortTime } from '@/utils/dateUtils'

interface AttendanceSelectorsProps {
  groups: GroupListItem[]
  groupId: string
  lessons: LessonItem[]
  lessonId: string
  onGroupChange: (groupId: string) => void
  onLessonChange: (lessonId: string) => void
}

export function AttendanceSelectors(props: AttendanceSelectorsProps) {
  const { groups, groupId, lessons, lessonId, onGroupChange, onLessonChange } = props
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-lg border border-border shadow-xs">
      <FormField label={t.attendance.group} htmlFor="attendance-group">
        <SelectInput
          id="attendance-group"
          value={groupId}
          disabled={groups.length === 0}
          onChange={(event) => onGroupChange(event.target.value)}
        >
          {groups.length === 0 && <option value="">{t.attendance.noGroups}</option>}
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name} — {group.courseName}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label={t.attendance.lesson} htmlFor="attendance-lesson">
        <SelectInput
          id="attendance-lesson"
          value={lessonId}
          disabled={lessons.length === 0}
          onChange={(event) => onLessonChange(event.target.value)}
        >
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {interpolate(t.attendance.lessonOption, {
                number: lesson.lessonNumber,
                date: formatDate(parseIsoDate(lesson.lessonDate)),
                time: shortTime(lesson.startTime),
                status: t.groups.lessonStatus[lesson.status],
              })}
            </option>
          ))}
        </SelectInput>
      </FormField>
    </div>
  )
}
