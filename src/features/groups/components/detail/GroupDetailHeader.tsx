import { Link, generatePath } from 'react-router-dom'
import { Edit2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { InfoItem } from '@/components/ui/InfoItem'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/routes/paths'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { parseIsoDate, shortTime } from '@/utils/dateUtils'
import type { GroupResponse } from '../../types/groupTypes'
import { formatScheduleDays } from '../../utils/groupSchedule'
import { GROUP_STATUS_VARIANT } from '../../utils/groupStatus'
import { GroupOccupancyBar } from '../GroupOccupancyBar'

interface GroupDetailHeaderProps {
  group: GroupResponse
  onEdit: () => void
  onDelete: () => void
}

export function GroupDetailHeader({ group, onEdit, onDelete }: GroupDetailHeaderProps) {
  const { t } = useTranslation()
  const fields = t.groups.fields
  const period = interpolate(t.groups.detail.periodValue, {
    from: formatDate(parseIsoDate(group.startDate)),
    to: group.endDate ? formatDate(parseIsoDate(group.endDate)) : t.groups.detail.openEnded,
  })

  return (
    <section className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-heading tracking-tight truncate">{group.name}</h1>
            <Badge variant={GROUP_STATUS_VARIANT[group.status]}>{t.groups.groupStatus[group.status]}</Badge>
          </div>
          <Link
            to={generatePath(ROUTES.COURSES.DETAIL, { id: group.courseId })}
            className="text-xs text-caption hover:text-primary transition-colors"
            title={t.groups.detail.openCourse}
          >
            {group.courseName}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <PermissionGuard permission={PERMISSIONS.GROUPS.UPDATE}>
            <Button variant="secondary" size="sm" onClick={onEdit}>
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t.groups.edit}</span>
            </Button>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.GROUPS.DELETE}>
            <Button variant="danger" size="sm" onClick={onDelete}>
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.groups.delete}</span>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoItem label={fields.teacher}>{group.teacherName || t.groups.noTeacher}</InfoItem>
        <InfoItem label={fields.branch}>{group.branchName}</InfoItem>
        <InfoItem label={fields.room}>{group.roomName || t.groups.noRoom}</InfoItem>
        <InfoItem label={fields.daysSchedule}>{formatScheduleDays(t, group)}</InfoItem>
        <InfoItem label={t.groups.detail.time}>
          {shortTime(group.startTime)} – {shortTime(group.endTime)}
        </InfoItem>
        <InfoItem label={t.groups.detail.period}>{period}</InfoItem>
        <InfoItem label={fields.monthlyPrice}>{formatCurrency(group.monthlyPrice)}</InfoItem>
        <InfoItem label={fields.billingMode}>{t.groups.billingMode[group.billingMode]}</InfoItem>
      </dl>

      <GroupOccupancyBar enrolled={group.enrolledStudentsCount} capacity={group.capacity} />
    </section>
  )
}
