import { useState, useMemo } from 'react'
import { Plus, Search, Coins, ChevronRight, PauseCircle, RefreshCw, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency, formatPhone } from '@/utils/formatters'
import { ROUTES } from '@/routes/paths'
import {
  STUDENT_STATUS,
  STUDENT_STATUS_LABELS,
  type StudentListItem,
} from '../types/studentTypes'
import { useStudentsList } from '../hooks/useStudents'
import { StudentModal } from '../components/StudentModal'
import { StudentFreezeModal } from '../components/StudentFreezeModal'
import { StudentEnrollModal } from '../components/StudentEnrollModal'

export function StudentListPage() {
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedStudentForFreeze, setSelectedStudentForFreeze] = useState<StudentListItem | null>(null)
  const [selectedStudentForEnroll, setSelectedStudentForEnroll] = useState<StudentListItem | null>(null)

  // Live query from backend API
  const { data: studentsData, isLoading, isError, refetch } = useStudentsList()
  const students = studentsData?.items || []

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const query = search.toLowerCase()
      const matchesSearch =
        s.fullName.toLowerCase().includes(query) ||
        s.phone.includes(query) ||
        (s.primaryGroup && s.primaryGroup.toLowerCase().includes(query))

      const matchesStatus =
        selectedStatus === 'all' || s.status.toString() === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [students, search, selectedStatus])

  const activeCount = students.filter((s) => s.status === STUDENT_STATUS.Active).length
  const debtorCount = students.filter(
    (s) => s.status === STUDENT_STATUS.Debtor || s.balance < 0
  ).length
  const frozenCount = students.filter((s) => s.status === STUDENT_STATUS.Frozen).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Талабалар рўйхати
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Ўқув марказининг барча фаол, қарздор ва музлатилган талабалари
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            title="Янгилаш"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Янги талаба қўшиш</span>
          </Button>
        </div>
      </div>

      {/* Toolbar / Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E3EAE5] shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B9C91]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Исм, телефон ёки гуруҳ бўйича..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F6F8F7] border border-[#E3EAE5] rounded-md text-[#1E2B24] placeholder:text-[#8B9C91] focus:outline-none focus:ring-1 focus:ring-[#146B52]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              selectedStatus === 'all'
                ? 'bg-[#146B52] text-white'
                : 'bg-[#F6F8F7] text-[#65776C] hover:bg-[#E8F3ED]'
            }`}
          >
            Барчаси ({students.length})
          </button>
          <button
            onClick={() => setSelectedStatus(STUDENT_STATUS.Active.toString())}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              selectedStatus === STUDENT_STATUS.Active.toString()
                ? 'bg-[#146B52] text-white'
                : 'bg-[#F6F8F7] text-[#65776C] hover:bg-[#E8F3ED]'
            }`}
          >
            Фаол ({activeCount})
          </button>
          <button
            onClick={() => setSelectedStatus(STUDENT_STATUS.Debtor.toString())}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              selectedStatus === STUDENT_STATUS.Debtor.toString()
                ? 'bg-[#BE123C] text-white'
                : 'bg-[#FFF1F2] text-[#BE123C] hover:bg-[#FFE4E6]'
            }`}
          >
            Қарздорлар ({debtorCount})
          </button>
          <button
            onClick={() => setSelectedStatus(STUDENT_STATUS.Frozen.toString())}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              selectedStatus === STUDENT_STATUS.Frozen.toString()
                ? 'bg-[#146B52] text-white'
                : 'bg-[#F6F8F7] text-[#65776C] hover:bg-[#E8F3ED]'
            }`}
          >
            Музлатилган ({frozenCount})
          </button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="bg-white border border-[#E3EAE5] rounded-lg p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-[#F0F4F1] last:border-none">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center space-y-3">
          <p className="text-xs text-red-600">Талабаларни юклашда хатолик юз берди</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Қайта уриниш
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredStudents.length === 0 && (
        <EmptyState
          title="Талабалар топилмади"
          description={
            search
              ? `"${search}" қидируви бўйича талаба топилмади.`
              : 'Тизимда ҳозирча талабалар мавжуд эмас. Янги талаба қўшинг ёки воронкадан лидни қабул қилинг.'
          }
          icon={<UserPlus className="w-5 h-5" />}
          action={
            <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              <span>Биринчи талабани қўшиш</span>
            </Button>
          }
        />
      )}

      {/* Students List Table */}
      {!isLoading && !isError && filteredStudents.length > 0 && (
        <div className="bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F6F8F7] border-b border-[#E3EAE5] text-[11px] font-semibold text-[#65776C] uppercase tracking-wider">
                  <th className="py-3 px-4">Талаба</th>
                  <th className="py-3 px-4">Асосий гуруҳ</th>
                  <th className="py-3 px-4">Ҳисоб баланси</th>
                  <th className="py-3 px-4">Тангалар</th>
                  <th className="py-3 px-4">Ҳолат</th>
                  <th className="py-3 px-4 text-right">Амаллар</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F1] text-xs">
                {filteredStudents.map((student) => {
                  const isDebtor = student.balance < 0

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-[#F9FBFA] transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <Link
                          to={`${ROUTES.STUDENTS.LIST}/${student.id}`}
                          className="font-bold text-[#1E2B24] hover:text-[#146B52] transition-colors"
                        >
                          {student.fullName}
                        </Link>
                        <p className="text-[11px] text-[#65776C] mt-0.5 tabular-nums">
                          {formatPhone(student.phone)}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-[#4D6255]">
                        {student.primaryGroup ? (
                          <span className="font-medium bg-[#E8F3ED] text-[#146B52] px-2 py-0.5 rounded text-[11px]">
                            {student.primaryGroup}
                          </span>
                        ) : (
                          <span className="text-[#8B9C91] text-[11px]">Гуруҳсиз</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold tabular-nums text-xs ${
                            isDebtor ? 'text-[#BE123C]' : 'text-[#047857]'
                          }`}
                        >
                          {formatCurrency(student.balance)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-semibold text-[#B45309] tabular-nums">
                          <Coins className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>{student.coinsBalance}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            student.status === STUDENT_STATUS.Active
                              ? 'success'
                              : isDebtor
                              ? 'danger'
                              : 'accent'
                          }
                        >
                          {STUDENT_STATUS_LABELS[student.status] || 'Фаол'}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedStudentForEnroll(student)}
                            title="Гуруҳга бириктириш"
                            className="p-1 rounded text-[#146B52] hover:bg-[#E8F3ED] text-[11px] font-medium"
                          >
                            + Гуруҳ
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedStudentForFreeze(student)}
                            title="Музлатиш"
                            className="p-1 text-[#65776C] hover:text-[#B45309] hover:bg-[#FEF3C7] rounded"
                          >
                            <PauseCircle className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`${ROUTES.STUDENTS.LIST}/${student.id}`}
                            className="p-1 text-[#65776C] hover:text-[#146B52] hover:bg-[#F0F4F1] rounded"
                            title="Профилни очиш"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <StudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <StudentFreezeModal
        isOpen={Boolean(selectedStudentForFreeze)}
        onClose={() => setSelectedStudentForFreeze(null)}
        student={selectedStudentForFreeze}
      />

      <StudentEnrollModal
        isOpen={Boolean(selectedStudentForEnroll)}
        onClose={() => setSelectedStudentForEnroll(null)}
        student={selectedStudentForEnroll}
      />
    </div>
  )
}
