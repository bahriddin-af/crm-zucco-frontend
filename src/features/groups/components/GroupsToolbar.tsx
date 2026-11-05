import { SearchInput } from '@/components/forms/SearchInput'
import { useTranslation } from '@/i18n'
import { useCoursesList } from '@/features/courses/hooks/useCourses'
import { SelectInput } from '@/components/forms/SelectInput'
import { OPTIONS_PAGE_SIZE } from '@/constants/pagination'
import { GROUP_STATUS_VALUES, type GroupStatus } from '../types/groupTypes'
import { useTeacherOptions } from '@/features/staff/hooks/useStaff'

export interface GroupsToolbarValue {
  search: string
  status?: GroupStatus
  courseId: string
  teacherId: string
}

interface GroupsToolbarProps {
  value: GroupsToolbarValue
  onChange: (value: GroupsToolbarValue) => void
}

const isGroupStatus = (value: number): value is GroupStatus =>
  (GROUP_STATUS_VALUES as readonly number[]).includes(value)

export function GroupsToolbar({ value, onChange }: GroupsToolbarProps) {
  const { t } = useTranslation()
  const { data: coursesPage } = useCoursesList({ pageSize: OPTIONS_PAGE_SIZE })
  const { data: teachers = [] } = useTeacherOptions()

  const handleStatus = (raw: string) => {
    const status = Number(raw)
    onChange({ ...value, status: isGroupStatus(status) ? status : undefined })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 bg-white p-3 rounded-lg border border-border shadow-xs">
      <SearchInput
        value={value.search}
        onChange={(search) => onChange({ ...value, search })}
        placeholder={t.groups.searchPlaceholder}
        className="sm:w-full"
      />

      <SelectInput aria-label={t.groups.fields.status} value={value.status ?? ''} onChange={(e) => handleStatus(e.target.value)}>
        <option value="">{t.groups.allStatuses}</option>
        {GROUP_STATUS_VALUES.map((status) => (
          <option key={status} value={status}>
            {t.groups.groupStatus[status]}
          </option>
        ))}
      </SelectInput>

      <SelectInput
        aria-label={t.groups.fields.course}
        value={value.courseId}
        onChange={(e) => onChange({ ...value, courseId: e.target.value })}
      >
        <option value="">{t.groups.allCourses}</option>
        {(coursesPage?.items ?? []).map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </SelectInput>

      <SelectInput
        aria-label={t.groups.fields.teacher}
        value={value.teacherId}
        onChange={(e) => onChange({ ...value, teacherId: e.target.value })}
      >
        <option value="">{t.groups.allTeachers}</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.fullName}
          </option>
        ))}
      </SelectInput>
    </div>
  )
}
