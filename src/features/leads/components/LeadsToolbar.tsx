import { useTranslation } from '@/i18n'
import { useCoursesList } from '@/features/courses/hooks/useCourses'
import { SearchInput } from '@/components/forms/SearchInput'
import { SelectInput } from '@/components/forms/SelectInput'

interface LeadsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  courseId: string
  onCourseChange: (courseId: string) => void
  totalLeads: number
}

export function LeadsToolbar({ search, onSearchChange, courseId, onCourseChange, totalLeads }: LeadsToolbarProps) {
  const { t } = useTranslation()
  const { data: coursesData } = useCoursesList()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-lg border border-border shadow-xs">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <SearchInput value={search} onChange={onSearchChange} placeholder={t.leads.searchPlaceholder} className="sm:w-72" />
        <SelectInput
          value={courseId}
          onChange={(e) => onCourseChange(e.target.value)}
          aria-label={t.leads.courseFilter}
          className="sm:w-56 min-h-[32px]"
        >
          <option value="">{t.leads.allCourses}</option>
          {(coursesData?.items ?? []).map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </SelectInput>
      </div>
      <div className="text-xs text-caption">
        {t.leads.totalLeads}: <strong className="text-heading tabular-nums">{totalLeads}</strong>
      </div>
    </div>
  )
}
