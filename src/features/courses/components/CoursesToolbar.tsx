import { SearchInput } from '@/components/forms/SearchInput'
import { useTranslation } from '@/i18n'
import { SelectInput } from '@/components/forms/SelectInput'
import { COURSE_STATUS_VALUES, type CourseStatus, type SubjectItem } from '../types/courseTypes'

export interface CoursesToolbarValue {
  search: string
  subjectId: string
  status?: CourseStatus
}

interface CoursesToolbarProps {
  value: CoursesToolbarValue
  subjects: SubjectItem[]
  onChange: (value: CoursesToolbarValue) => void
}

const isCourseStatus = (value: number): value is CourseStatus =>
  (COURSE_STATUS_VALUES as readonly number[]).includes(value)

export function CoursesToolbar({ value, subjects, onChange }: CoursesToolbarProps) {
  const { t } = useTranslation()

  const handleStatus = (raw: string) => {
    const status = Number(raw)
    onChange({ ...value, status: isCourseStatus(status) ? status : undefined })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-surface p-3 rounded-lg border border-border shadow-xs">
      <SearchInput
        value={value.search}
        onChange={(search) => onChange({ ...value, search })}
        placeholder={t.courses.searchPlaceholder}
        className="sm:w-full"
      />

      <SelectInput
        aria-label={t.courses.fields.subject}
        value={value.subjectId}
        onChange={(event) => onChange({ ...value, subjectId: event.target.value })}
      >
        <option value="">{t.courses.allSubjects}</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </SelectInput>

      <SelectInput aria-label={t.courses.fields.status} value={value.status ?? ''} onChange={(e) => handleStatus(e.target.value)}>
        <option value="">{t.courses.allStatuses}</option>
        {COURSE_STATUS_VALUES.map((status) => (
          <option key={status} value={status}>
            {t.courses.statuses[status]}
          </option>
        ))}
      </SelectInput>
    </div>
  )
}
