import { Edit2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { InfoItem } from '@/components/ui/InfoItem'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import type { CourseResponse } from '../../types/courseTypes'
import { COURSE_STATUS_VARIANT } from '../../utils/courseStatus'

interface CourseDetailHeaderProps {
  course: CourseResponse
  onEdit: () => void
  onDelete: () => void
}

export function CourseDetailHeader({ course, onEdit, onDelete }: CourseDetailHeaderProps) {
  const { t } = useTranslation()

  return (
    <section className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <span className="text-3xs font-bold text-primary bg-primary-soft px-2 py-0.5 rounded">{course.subjectName}</span>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-heading tracking-tight truncate">{course.name}</h1>
            <Badge variant={COURSE_STATUS_VARIANT[course.status]}>{t.courses.statuses[course.status]}</Badge>
          </div>
          <p className="text-xs text-caption">{t.courses.levels[course.level]}</p>
        </div>
        <div className="flex items-center gap-2">
          <PermissionGuard permission={PERMISSIONS.COURSES.UPDATE}>
            <Button variant="secondary" size="sm" onClick={onEdit}>
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t.courses.edit}</span>
            </Button>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.COURSES.DELETE}>
            <Button variant="danger" size="sm" onClick={onDelete}>
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.courses.delete}</span>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoItem label={t.courses.fields.durationMonths}>
          {interpolate(t.courses.duration, {
            months: course.durationMonths,
            lessons: course.durationMonths * course.lessonsPerMonth,
          })}
        </InfoItem>
        <InfoItem label={t.courses.fields.lessonsPerMonth}>
          {interpolate(t.courses.lessonsInfo, {
            perMonth: course.lessonsPerMonth,
            minutes: course.lessonDurationMinutes,
          })}
        </InfoItem>
        <InfoItem label={t.courses.fields.basePrice}>
          {interpolate(t.courses.perMonth, { price: formatCurrency(course.basePrice) })}
        </InfoItem>
      </dl>

      <p className="text-xs text-copy whitespace-pre-line">{course.description || t.courses.detail.noDescription}</p>
    </section>
  )
}
