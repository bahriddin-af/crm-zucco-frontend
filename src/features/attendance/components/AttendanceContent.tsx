import { BookOpen, Sparkles, Users } from 'lucide-react'
import type { UseQueryResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { DEFAULT_GENERATED_LESSONS, type LessonItem } from '@/features/groups/types/groupTypes'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { useGenerateSchedule } from '../hooks/useAttendance'
import { AttendanceSheet } from './AttendanceSheet'

const SKELETON_ROWS = 4

interface AttendanceContentProps {
  hasGroups: boolean
  groupId: string
  lessonsQuery: UseQueryResult<LessonItem[]>
  lesson?: LessonItem
  today: string
}

/** Guruh → dars tanlovi holatlari (yuklanish/xato/bo'sh) va tanlangan dars varag'i. */
export function AttendanceContent({ hasGroups, groupId, lessonsQuery, lesson, today }: AttendanceContentProps) {
  const { t } = useTranslation()
  const generateMutation = useGenerateSchedule()

  if (!hasGroups) {
    return <EmptyState title={t.attendance.emptyNoGroupsTitle} description={t.attendance.emptyNoGroups} icon={<Users className="w-5 h-5" />} />
  }
  if (lessonsQuery.isLoading) {
    return (
      <ListSkeleton rows={SKELETON_ROWS} rowClassName="h-12 w-full" className="bg-white border border-border rounded-lg p-5 space-y-3" />
    )
  }
  if (lessonsQuery.isError) {
    return <ErrorState error={lessonsQuery.error} onRetry={() => void lessonsQuery.refetch()} />
  }
  if (!lesson) {
    return (
      <EmptyState
        title={t.attendance.emptyNoLessonsTitle}
        description={t.attendance.emptyNoLessons}
        icon={<BookOpen className="w-5 h-5" />}
        action={
          <PermissionGuard permission={PERMISSIONS.GROUPS.UPDATE}>
            <Button
              variant="primary"
              size="sm"
              isLoading={generateMutation.isPending}
              onClick={() => generateMutation.mutate({ groupId, totalLessons: DEFAULT_GENERATED_LESSONS })}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.attendance.generateSchedule}</span>
            </Button>
          </PermissionGuard>
        }
      />
    )
  }

  return (
    <ErrorBoundary>
      <AttendanceSheet lesson={lesson} today={today} />
    </ErrorBoundary>
  )
}
