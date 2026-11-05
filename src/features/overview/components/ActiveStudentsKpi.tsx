import { Users } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { useStudentsList } from '@/features/students/hooks/useStudents'
import { STUDENT_STATUS } from '@/features/students/types/studentTypes'
import { KpiCard } from './KpiCard'

/** Faqat `totalCount` kerak — bitta yozuvli sahifa so'raladi. */
const COUNT_ONLY_PAGE_SIZE = 1

export function ActiveStudentsKpi() {
  const { t } = useTranslation()
  const { data, isLoading, error, refetch } = useStudentsList({
    status: STUDENT_STATUS.Active,
    pageSize: COUNT_ONLY_PAGE_SIZE,
  })

  return (
    <KpiCard
      label={t.overview.activeStudents}
      icon={Users}
      isLoading={isLoading}
      error={error}
      onRetry={() => void refetch()}
      value={
        <>
          {data?.totalCount ?? 0} <span className="text-xs font-normal text-caption">{t.common.studentUnit}</span>
        </>
      }
      hint={t.overview.activeStudentsHint}
    />
  )
}
