import { Clock, Edit2, Layers, Trash2 } from 'lucide-react'
import { Badge, type BadgeProps } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { COURSE_STATUS, type CourseListItem, type CourseStatus } from '../types/courseTypes'

const STATUS_VARIANT: Record<CourseStatus, NonNullable<BadgeProps['variant']>> = {
  [COURSE_STATUS.Active]: 'success',
  [COURSE_STATUS.Inactive]: 'warning',
  [COURSE_STATUS.Archived]: 'default',
}

interface CourseCardProps {
  course: CourseListItem
  onEdit: (course: CourseListItem) => void
  onDelete: (course: CourseListItem) => void
}

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const { t } = useTranslation()

  return (
    <article className="bg-white border border-border rounded-lg p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-primary-line hover:shadow-sm transition-all">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-primary bg-primary-soft px-2 py-0.5 rounded truncate max-w-[60%]">
            {course.subjectName}
          </span>
          <Badge variant={STATUS_VARIANT[course.status]}>{t.courses.statuses[course.status]}</Badge>
        </div>
        <h3 className="text-sm font-bold text-heading">{course.name}</h3>
        <p className="text-[11px] text-caption">{t.courses.levels[course.level]}</p>
        <div className="flex items-center gap-1.5 text-xs text-caption">
          <Clock className="w-3.5 h-3.5 text-subtle" />
          <span>
            {interpolate(t.courses.duration, {
              months: course.durationMonths,
              lessons: course.durationMonths * course.lessonsPerMonth,
            })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-caption">
          <Layers className="w-3.5 h-3.5 text-subtle" />
          <span>
            {interpolate(t.courses.lessonsInfo, {
              perMonth: course.lessonsPerMonth,
              minutes: course.lessonDurationMinutes,
            })}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-divider flex items-center justify-between">
        <span className="text-sm font-bold text-primary tabular-nums">
          {interpolate(t.courses.perMonth, { price: formatCurrency(course.basePrice) })}
        </span>
        <div className="flex items-center gap-0.5">
          <PermissionGuard permission={PERMISSIONS.COURSES.UPDATE}>
            <Button variant="ghost" size="icon" aria-label={t.courses.edit} title={t.courses.edit} onClick={() => onEdit(course)}>
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.COURSES.DELETE}>
            <Button variant="ghost" size="icon" aria-label={t.courses.delete} title={t.courses.delete} onClick={() => onDelete(course)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </PermissionGuard>
        </div>
      </div>
    </article>
  )
}
