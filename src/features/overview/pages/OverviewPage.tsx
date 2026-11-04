import {
  Users,
  TrendingUp,
  Clock,
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

export function OverviewPage() {
  const { t } = useTranslation()

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
        {/* Metric 1 */}
        <div className="p-4 bg-white border border-[#E3EAE5] rounded-lg shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-[#65776C]">
              {t.overview.activeStudents}
            </span>
            <div className="w-7 h-7 rounded-md bg-[#E8F3ED] text-[#146B52] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1E2B24] tabular-nums tracking-tight">
            148 <span className="text-xs font-normal text-[#65776C]">{t.common.studentUnit}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#047857]">
            <ArrowUpRight className="w-3 h-3" />
            <span>{t.overview.vsLastMonth} +8.4%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-white border border-[#E3EAE5] rounded-lg shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-[#65776C]">
              {t.overview.monthlyRevenue}
            </span>
            <div className="w-7 h-7 rounded-md bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1E2B24] tabular-nums tracking-tight">
            {formatCurrency(42500000)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#047857]">
            <ArrowUpRight className="w-3 h-3" />
            <span>{t.overview.planProgress}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-white border border-[#E3EAE5] rounded-lg shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-[#65776C]">
              {t.overview.avgAttendance}
            </span>
            <div className="w-7 h-7 rounded-md bg-[#E8F3ED] text-[#146B52] flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1E2B24] tabular-nums tracking-tight">
            94.2%
          </div>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#65776C]">
            <span>{t.overview.todayLessons}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 bg-white border border-[#E3EAE5] rounded-lg shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-[#65776C]">
              {t.overview.debt}
            </span>
            <div className="w-7 h-7 rounded-md bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#BE123C] tabular-nums tracking-tight">
            {formatCurrency(5600000)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#BE123C]">
            <span>{t.overview.debtCount}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Schedule */}
        <div className="lg:col-span-2 bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3EAE5]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#146B52]" />
              <h2 className="text-xs font-semibold text-[#1E2B24]">
                {t.overview.todayLessons}
              </h2>
            </div>
            <Link
              to={ROUTES.SCHEDULE}
              className="text-[11px] font-medium text-[#146B52] hover:underline flex items-center gap-1"
            >
              {t.overview.fullSchedule}
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#F0F4F1]">
            {[
              {
                group: 'IELTS Foundation · IF-09',
                teacher: 'Азиз Каримов',
                room: '302',
                time: '14:00 - 15:30',
                students: `12 / 14 ${t.common.studentUnit}`,
                status: t.common.active,
                statusVariant: 'success' as const,
              },
              {
                group: 'General English · GE-04',
                teacher: 'Шаҳноза Раҳимова',
                room: '104',
                time: '15:30 - 17:00',
                students: `10 / 12 ${t.common.studentUnit}`,
                status: t.common.active,
                statusVariant: 'accent' as const,
              },
              {
                group: 'Frontend React · FE-02',
                teacher: 'Жасур Алимов',
                room: 'Lab-1',
                time: '17:00 - 18:30',
                students: `14 / 16 ${t.common.studentUnit}`,
                status: t.common.active,
                statusVariant: 'accent' as const,
              },
            ].map((lesson, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 hover:bg-[#F6F8F7] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1E2B24]">
                      {lesson.group}
                    </span>
                    <Badge variant={lesson.statusVariant}>{lesson.status}</Badge>
                  </div>
                  <p className="text-[11px] text-[#65776C]">
                    <strong className="text-[#344B3E] font-medium">{lesson.teacher}</strong> · {lesson.room}-хона
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#1E2B24] tabular-nums">
                    {lesson.time}
                  </p>
                  <p className="text-[10px] text-[#65776C]">{lesson.students}</p>
                </div>
              </div>
            ))}
          </div>
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
            {[
              { label: t.leads.stages.new, count: 18, color: 'bg-[#2F8060]' },
              { label: t.leads.stages.contacted, count: 14, color: 'bg-[#32856B]' },
              { label: t.leads.stages.trialScheduled, count: 9, color: 'bg-[#4F9270]' },
              { label: t.leads.stages.trialAttended, count: 7, color: 'bg-[#F59E0B]' },
              { label: t.leads.stages.converted, count: 12, color: 'bg-[#059669]' },
            ].map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#65776C]">{stage.label}</span>
                  <span className="font-semibold text-[#1E2B24] tabular-nums">
                    {stage.count}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#EDF2EE] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-full`}
                    style={{ width: `${(stage.count / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
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
