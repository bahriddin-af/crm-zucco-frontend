import { useState, useMemo } from 'react'
import {
  Plus,
  Calendar,
  Clock,
  Search,
  Users,
  RefreshCw,
  Building,
  Edit2,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency } from '@/utils/formatters'
import {
  DAY_SCHEDULE_LABELS,
  GROUP_STATUS,
  GROUP_STATUS_LABELS,
  type GroupListItem,
} from '../types/groupTypes'
import { useGroupsList, useDeleteGroup } from '../hooks/useGroups'
import { GroupModal } from '../components/GroupModal'

export function GroupListPage() {
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<GroupListItem | null>(null)

  // Live Query from Backend API
  const {
    data: groupsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGroupsList()

  const deleteMutation = useDeleteGroup()

  const groups = groupsData?.items || []

  // Filter groups by search query and status tab
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const query = search.toLowerCase()
      const matchesSearch =
        g.name.toLowerCase().includes(query) ||
        g.courseName.toLowerCase().includes(query) ||
        g.teacherName.toLowerCase().includes(query) ||
        g.roomName.toLowerCase().includes(query)

      const matchesStatus =
        selectedStatus === 'all' || g.status.toString() === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [groups, search, selectedStatus])

  const handleDelete = (group: GroupListItem) => {
    if (window.confirm(`"${group.name}" гуруҳини ўчиришни тасдиқлайсизми?`)) {
      deleteMutation.mutate(group)
    }
  }

  const handleEdit = (group: GroupListItem) => {
    setSelectedGroup(group)
    setIsModalOpen(true)
  }

  const handleOpenCreate = () => {
    setSelectedGroup(null)
    setIsModalOpen(true)
  }

  const activeCount = groups.filter((g) => g.status === GROUP_STATUS.Active).length
  const recruitingCount = groups.filter(
    (g) => g.status === GROUP_STATUS.Recruiting
  ).length

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Ўқув гуруҳлари
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Фаол ва режалаштирилган гуруҳлар, сиғим, ўқитувчилар ва дарслар жадвали
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
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <Plus className="w-3.5 h-3.5" />
            <span>Янги гуруҳ очиш</span>
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
            placeholder="Гуруҳ, курс, ўқитувчи ёки хона..."
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
            Барчаси ({groups.length})
          </button>
          <button
            onClick={() => setSelectedStatus(GROUP_STATUS.Active.toString())}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              selectedStatus === GROUP_STATUS.Active.toString()
                ? 'bg-[#146B52] text-white'
                : 'bg-[#F6F8F7] text-[#65776C] hover:bg-[#E8F3ED]'
            }`}
          >
            Фаол ({activeCount})
          </button>
          <button
            onClick={() => setSelectedStatus(GROUP_STATUS.Recruiting.toString())}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              selectedStatus === GROUP_STATUS.Recruiting.toString()
                ? 'bg-[#146B52] text-white'
                : 'bg-[#F6F8F7] text-[#65776C] hover:bg-[#E8F3ED]'
            }`}
          >
            Қабул очиқ ({recruitingCount})
          </button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#E3EAE5] rounded-lg p-5 space-y-3.5"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="pt-2 border-t border-[#F0F4F1] flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center space-y-3">
          <p className="text-xs text-red-600">
            Гуруҳларни юклашда хатолик юз берди:{' '}
            {error instanceof Error ? error.message : 'Серверга уланиш имконсиз'}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Қайта уриниш
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredGroups.length === 0 && (
        <EmptyState
          title="Гуруҳлар топилмади"
          description={
            search
              ? `"${search}" қидируви бўйича ҳеч қандай гуруҳ топилмади.`
              : 'Тизимда ҳозирча ўқув гуруҳлари мавжуд эмас. Биринчи гуруҳни очинг.'
          }
          icon={<Users className="w-5 h-5" />}
          action={
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              <Plus className="w-3.5 h-3.5" />
              <span>Биринчи гуруҳни очиш</span>
            </Button>
          }
        />
      )}

      {/* Live Groups Grid */}
      {!isLoading && !isError && filteredGroups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => {
            const isAlmostFull = group.enrolledStudentsCount >= group.capacity - 2
            const occupancyPercent = Math.min(
              100,
              Math.round((group.enrolledStudentsCount / Math.max(1, group.capacity)) * 100)
            )

            const scheduleDaysText =
              DAY_SCHEDULE_LABELS[group.daysSchedule] || 'Кунлар белгиланмаган'
            const timeText = `${group.startTime.slice(0, 5)} - ${group.endTime.slice(0, 5)}`

            const statusVariant =
              group.status === GROUP_STATUS.Active
                ? 'success'
                : group.status === GROUP_STATUS.Recruiting
                ? 'accent'
                : 'default'

            return (
              <div
                key={group.id}
                className="group relative bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs space-y-3.5 hover:border-[#BBDCCB] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[#1E2B24] truncate group-hover:text-[#146B52] transition-colors">
                        {group.name}
                      </h3>
                      <p className="text-xs text-[#65776C] mt-0.5 truncate font-medium">
                        {group.courseName}
                      </p>
                    </div>
                    <Badge variant={statusVariant}>
                      {GROUP_STATUS_LABELS[group.status] || 'Фаол'}
                    </Badge>
                  </div>

                  {/* Teacher & Room */}
                  <div className="flex items-center justify-between text-xs text-[#65776C] pt-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <Users className="w-3.5 h-3.5 text-[#8B9C91] shrink-0" />
                      <span className="truncate">{group.teacherName || 'Мураббий бириктирилмаган'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#4D6255] bg-[#F6F8F7] px-2 py-0.5 rounded border border-[#E3EAE5] shrink-0">
                      <Building className="w-3 h-3 text-[#146B52]" />
                      <span>{group.roomName || 'Хона йўқ'}</span>
                    </div>
                  </div>

                  {/* Schedule & Time */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#4D6255] bg-[#F6F8F7] p-2.5 rounded-md border border-[#E3EAE5]">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-[#146B52] shrink-0" />
                      <span className="truncate">{scheduleDaysText}</span>
                    </div>
                    <div className="flex items-center gap-1.5 tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-[#146B52] shrink-0" />
                      <span>{timeText}</span>
                    </div>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#65776C]">Гуруҳ сиғими</span>
                      <span
                        className={`font-semibold tabular-nums ${
                          isAlmostFull ? 'text-[#BE123C]' : 'text-[#047857]'
                        }`}
                      >
                        {group.enrolledStudentsCount} / {group.capacity} талаба ({occupancyPercent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#EDF2EE] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isAlmostFull ? 'bg-[#E11D48]' : 'bg-[#146B52]'
                        }`}
                        style={{ width: `${occupancyPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer with Price & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F0F4F1] text-xs">
                  <div>
                    <span className="block text-[10px] text-[#65776C]">Ойлик тўлов:</span>
                    <span className="font-bold text-[#146B52] tabular-nums text-sm">
                      {formatCurrency(group.monthlyPrice)} / ой
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleEdit(group)}
                      className="p-1.5 text-[#65776C] hover:text-[#146B52] hover:bg-[#F0F4F1] rounded transition-colors cursor-pointer"
                      title="Таҳрирлаш"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(group)}
                      className="p-1.5 text-[#65776C] hover:text-[#BE123C] hover:bg-[#FFF1F2] rounded transition-colors cursor-pointer"
                      title="Ўчириш"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Group Create/Edit Modal */}
      <GroupModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedGroup(null)
        }}
        groupToEdit={selectedGroup}
      />
    </div>
  )
}
