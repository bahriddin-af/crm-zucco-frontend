import {
  Users,
  TrendingUp,
  Wallet,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  BookOpen,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/formatters'
import { useTranslation } from '@/i18n'
import { useFinanceSummary } from '@/features/finance/hooks/useFinance'
import { useStudentsList } from '@/features/students/hooks/useStudents'
import { useGroupsList } from '@/features/groups/hooks/useGroups'
import { useKanbanBoard } from '@/features/leads/hooks/useLeads'

export function OverviewPage() {
  const { t } = useTranslation()

  const { data: financeSummary, isLoading: isLoadingFinance } = useFinanceSummary()
  const { data: studentsData, isLoading: isLoadingStudents } = useStudentsList()
  const { data: groupsData, isLoading: isLoadingGroups } = useGroupsList()
  const { data: kanbanColumns = [], isLoading: isLoadingKanban } = useKanbanBoard()

  const totalStudents = studentsData?.totalCount || 0
  const groups = groupsData?.items || []

  // Jami lidlar soni
  const totalLeads = kanbanColumns.reduce((sum, col) => sum + (col.totalLeads || 0), 0)

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            {t.overview.title}
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            {t.overview.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={ROUTES.LEADS.LIST}>
            <Button variant="secondary" size="sm">
              {t.leads.addNew}
            </Button>
          </Link>
          <Link to={ROUTES.FINANCE.DESK}>
            <Button variant="primary" size="sm">
              {t.finance.acceptPayment}
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Faol Talabalar */}
        <div className="p-4 bg-white border border-[#E3EAE5] rounded-lg shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-[#65776C]">
              {t.overview.activeStudents}
            </span>
            <div className="w-7 h-7 rounded-md bg-[#E8F3ED] text-[#146B52] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          {isLoadingStudents ? (
            <div className="h-7 w-20 bg-[#F0F3F1] rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-bold text-[#1E2B24] tabular-nums tracking-tight">
              {totalStudents} <span className="text-xs font-normal text-[#65776C]">{t.common.studentUnit}</span>
            </div>
          )}
          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#047857]">
            <ArrowUpRight className="w-3 h-3" />
            <span>Тизимдаги жами фаол талабалар</span>
          </div>
        </div>

        {/* Metric 2: Oylik Tushum */}
        <div className="p-4 bg-white border border-[#E3EAE5] rounded-lg shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-[#65776C]">
              {t.overview.monthlyRevenue}
            </span>
            <div className="w-7 h-7 rounded-md bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          {isLoadingFinance ? (
            <div className="h-7 w-28 bg-[#F0F3F1] rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-bold text-[#1E2B24] tabular-nums tracking-tight">
              {formatCurrency(financeSummary?.totalPaymentsThisMonth || 0)}
            </div>
          )}
          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#047857]">
            <ArrowUpRight className="w-3 h-3" />
            <span>Жорий ойдаги расмий тўловлар</span>
          </div>
        </div>

        {/* Metric 3: Kassa Balansi */}
        <div className="p-4 bg-white border border-[#E3EAE5] rounded-lg shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-[#65776C]">
              Жами касса қолдиғи
            </span>
            <div className="w-7 h-7 rounded-md bg-[#E8F3ED] text-[#146B52] flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          {isLoadingFinance ? (
            <div className="h-7 w-28 bg-[#F0F3F1] rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-bold text-[#1E2B24] tabular-nums tracking-tight">
              {formatCurrency(financeSummary?.totalCashBalance || 0)}
            </div>
          )}
          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#65776C]">
            <span>{financeSummary?.cashAccounts?.length || 0} та касса ҳисобида</span>
          </div>
        </div>

        {/* Metric 4: Qarzdorlik */}
        <div className="p-4 bg-white border border-[#E3EAE5] rounded-lg shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-[#65776C]">
              {t.overview.debt}
            </span>
            <div className="w-7 h-7 rounded-md bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          {isLoadingFinance ? (
            <div className="h-7 w-28 bg-[#F0F3F1] rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-bold text-[#BE123C] tabular-nums tracking-tight">
              {formatCurrency(financeSummary?.totalStudentDebt || 0)}
            </div>
          )}
          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#BE123C]">
            <span>{financeSummary?.totalDebtorsCount || 0} та қарздор талаба</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Groups */}
        <div className="lg:col-span-2 bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3EAE5]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#146B52]" />
              <h2 className="text-xs font-semibold text-[#1E2B24]">
                Фаол ўқув гуруҳлари
              </h2>
            </div>
            <Link
              to={ROUTES.GROUPS.LIST}
              className="text-[11px] font-medium text-[#146B52] hover:underline flex items-center gap-1"
            >
              Барча гуруҳлар
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoadingGroups ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-[#F8FAF9] rounded animate-pulse" />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5A6C62]">
              Ҳозирча гуруҳлар мавжуд эмас.
            </div>
          ) : (
            <div className="divide-y divide-[#F0F4F1]">
              {groups.slice(0, 5).map((grp) => (
                <div
                  key={grp.id}
                  className="flex items-center justify-between p-4 hover:bg-[#F6F8F7] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#1E2B24]">
                        {grp.courseName} · {grp.name}
                      </span>
                      <Badge variant="success">Фаол</Badge>
                    </div>
                    <p className="text-[11px] text-[#65776C]">
                      <strong className="text-[#344B3E] font-medium">{grp.teacherName || 'Ўқитувчи тайинланмаган'}</strong> · {grp.roomName || 'Хона тайинланмаган'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#1E2B24] tabular-nums">
                      {grp.startTime.slice(0, 5)} - {grp.endTime.slice(0, 5)}
                    </p>
                    <p className="text-[10px] text-[#65776C]">
                      {grp.enrolledStudentsCount} / {grp.capacity} {t.common.studentUnit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Leads Funnel Preview */}
        <div className="bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3EAE5]">
            <h2 className="text-xs font-semibold text-[#1E2B24]">
              {t.overview.funnelState}
            </h2>
            <Link
              to={ROUTES.LEADS.LIST}
              className="text-[11px] font-medium text-[#146B52] hover:underline flex items-center gap-1"
            >
              {t.overview.goToFunnel}
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4 space-y-3.5 flex-1">
            {isLoadingKanban ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-6 bg-[#F8FAF9] rounded animate-pulse" />
                ))}
              </div>
            ) : kanbanColumns.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#5A6C62]">
                Лидлар босқичлари юкланмоқда...
              </div>
            ) : (
              kanbanColumns.map((col) => {
                const totalInBoard = totalLeads || 1
                const percent = Math.min(100, Math.round((col.totalLeads / Math.max(1, totalInBoard)) * 100))
                return (
                  <div key={col.stageId} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#65776C]">{col.stageName}</span>
                      <span className="font-semibold text-[#1E2B24] tabular-nums">
                        {col.totalLeads}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#EDF2EE] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: col.colorHex || '#027A48',
                        }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="p-4 border-t border-[#E3EAE5] bg-[#F6F8F7]">
            <Link to={ROUTES.LEADS.LIST}>
              <Button variant="secondary" size="sm" className="w-full">
                {t.overview.goToFunnel}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
