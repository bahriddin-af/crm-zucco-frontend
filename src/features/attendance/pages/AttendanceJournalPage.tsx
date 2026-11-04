import { useState } from 'react'
import {
  Save,
  Check,
  X,
  Clock,
  AlertTriangle,
  Coins,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'sonner'

interface AttendanceRecord {
  studentId: string
  studentName: string
  studentCode: string
  status: 'Present' | 'Excused' | 'Unexcused' | 'Late'
  coins: number
  score: number // 0 - 100
  isFrozen?: boolean
}

const INITIAL_RECORDS: AttendanceRecord[] = [
  {
    studentId: 'zu-0248',
    studentName: 'Темур Бекмирзаев',
    studentCode: 'ZU-0248',
    status: 'Present',
    coins: 5,
    score: 92,
  },
  {
    studentId: 'zu-0189',
    studentName: 'Шаҳзода Низомова',
    studentCode: 'ZU-0189',
    status: 'Present',
    coins: 5,
    score: 88,
  },
  {
    studentId: 'zu-0312',
    studentName: 'Жаҳонгир Олимов',
    studentCode: 'ZU-0312',
    status: 'Excused',
    coins: 0,
    score: 0,
    isFrozen: true,
  },
  {
    studentId: 'zu-0155',
    studentName: 'Камила Исмоилова',
    studentCode: 'ZU-0155',
    status: 'Late',
    coins: 5,
    score: 80,
  },
]

export function AttendanceJournalPage() {
  const [selectedGroup, setSelectedGroup] = useState('g1')
  const [selectedDate, setSelectedDate] = useState('2026-11-03')
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_RECORDS)
  const [isSaving, setIsSaving] = useState(false)

  // Status o'zgartirish mantig'i: Present ga o'tganda avtomatik +5 tanga, chiqsa -5 tanga
  const handleStatusChange = (
    studentId: string,
    newStatus: AttendanceRecord['status']
  ) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.studentId !== studentId || r.isFrozen) return r

        let newCoins = r.coins
        if (r.status !== 'Present' && newStatus === 'Present') {
          newCoins += 5
        } else if (r.status === 'Present' && newStatus !== 'Present') {
          newCoins = Math.max(0, newCoins - 5)
        }

        return {
          ...r,
          status: newStatus,
          coins: newCoins,
        }
      })
    )
  }

  // Qo'shimcha rag'batlantirish tangalari (+1 yoki +5)
  const handleBonusCoins = (studentId: string, amount: number) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.studentId === studentId && !r.isFrozen
          ? { ...r, coins: r.coins + amount }
          : r
      )
    )
    toast.success(`Талабага +${amount} танга рағбат қўшилди!`)
  }

  const handleScoreChange = (studentId: string, score: number) => {
    const clampedScore = Math.min(100, Math.max(0, score))
    setRecords((prev) =>
      prev.map((r) =>
        r.studentId === studentId ? { ...r, score: clampedScore } : r
      )
    )
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Давомат ва тангалар муваффақиятли сақланди!')
    }, 400)
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Давомат ва тангалар журнали
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Дарс давоматини қайд этиш, автоматик тангалар ва қўшимча рағбат
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          isLoading={isSaving}
        >
          <Save className="w-3.5 h-3.5" />
          <span>Давоматни сақлаш</span>
        </Button>
      </div>

      {/* Select Group & Lesson Date Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E3EAE5] shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-semibold text-[#65776C] block uppercase mb-1">
              Гуруҳ
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="min-h-[34px] rounded-md border border-[#E3EAE5] bg-[#F6F8F7] px-3 py-1.5 text-xs text-[#1E2B24] font-medium focus:outline-none focus:ring-2 focus:ring-[#418A66]"
            >
              <option value="g1">IELTS Foundation · IF-09 (14:00 - 15:30)</option>
              <option value="g2">General English · GE-04 (15:30 - 17:00)</option>
              <option value="g3">Frontend React · FE-02 (17:00 - 18:30)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#65776C] block uppercase mb-1">
              Дарс санаси
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="min-h-[34px] rounded-md border border-[#E3EAE5] bg-[#F6F8F7] px-3 py-1.5 text-xs text-[#1E2B24] focus:outline-none focus:ring-2 focus:ring-[#418A66]"
              />
            </div>
          </div>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="success">
            Қатнашди: {records.filter((r) => r.status === 'Present').length}
          </Badge>
          <Badge variant="warning">
            Кечикди: {records.filter((r) => r.status === 'Late').length}
          </Badge>
          <Badge variant="danger">
            Келмади: {records.filter((r) => r.status === 'Unexcused').length}
          </Badge>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F6F8F7] border-b border-[#E3EAE5] text-[#65776C] text-[11px] font-semibold">
                <th className="py-3 px-4 w-[28%]">Талаба</th>
                <th className="py-3 px-4 w-[34%]">Давомат ҳолати</th>
                <th className="py-3 px-4 w-[14%]">Баҳо (0-100)</th>
                <th className="py-3 px-4 w-[24%] text-right">Тангалар ва рағбат</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F1]">
              {records.map((r) => (
                <tr key={r.studentId} className="hover:bg-[#FCFEFC] transition-colors">
                  {/* Student */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#1E2B24] block">
                      {r.studentName}
                    </span>
                    <span className="text-[10px] text-[#8B9C91]">
                      {r.studentCode}
                      {r.isFrozen && (
                        <span className="ml-1.5 text-[#BE123C] font-semibold bg-[#FFF1F2] px-1.5 py-0.2 rounded">
                          Музлатилган
                        </span>
                      )}
                    </span>
                  </td>

                  {/* Attendance Status Buttons */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {[
                        { id: 'Present', label: 'Қатнашди', icon: Check, color: 'text-[#047857]' },
                        { id: 'Late', label: 'Кечикди', icon: Clock, color: 'text-[#C2410C]' },
                        { id: 'Excused', label: 'Узрли', icon: AlertTriangle, color: 'text-[#92400E]' },
                        { id: 'Unexcused', label: 'Узрсиз', icon: X, color: 'text-[#BE123C]' },
                      ].map((st) => {
                        const Icon = st.icon
                        const isSelected = r.status === st.id
                        return (
                          <button
                            key={st.id}
                            type="button"
                            disabled={r.isFrozen}
                            onClick={() =>
                              handleStatusChange(
                                r.studentId,
                                st.id as AttendanceRecord['status']
                              )
                            }
                            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium border transition-all ${
                              isSelected
                                ? 'bg-[#E8F3ED] border-[#146B52] text-[#146B52] font-semibold shadow-2xs'
                                : 'bg-white border-[#E3EAE5] text-[#65776C] hover:bg-[#F6F8F7]'
                            } ${r.isFrozen ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{st.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </td>

                  {/* Grade Score (0-100) */}
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      disabled={r.isFrozen || r.status === 'Unexcused'}
                      value={r.score || ''}
                      onChange={(e) =>
                        handleScoreChange(r.studentId, parseInt(e.target.value) || 0)
                      }
                      placeholder="—"
                      className="w-14 h-8 text-center text-xs font-semibold rounded-md border border-[#E3EAE5] bg-white tabular-nums focus:outline-none focus:ring-1 focus:ring-[#146B52] disabled:bg-[#F6F8F7] disabled:opacity-50"
                    />
                  </td>

                  {/* Coins & Bonus Incentive */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex items-center gap-1 text-[#92400E] font-bold text-xs tabular-nums bg-[#FFFBEB] border border-[#FDE68A] px-2 py-1 rounded">
                        <Coins className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>+{r.coins}</span>
                      </div>

                      {/* Extra bonus reward buttons */}
                      <button
                        type="button"
                        disabled={r.isFrozen}
                        onClick={() => handleBonusCoins(r.studentId, 1)}
                        title="+1 танга рағбат"
                        className="h-7 px-1.5 rounded border border-[#E3EAE5] text-[10px] font-semibold text-[#4D6255] hover:bg-[#E8F3ED] hover:text-[#146B52] transition-colors disabled:opacity-40"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        disabled={r.isFrozen}
                        onClick={() => handleBonusCoins(r.studentId, 5)}
                        title="+5 танга фаоллик учун"
                        className="h-7 px-1.5 rounded border border-[#E3EAE5] text-[10px] font-semibold text-[#4D6255] hover:bg-[#E8F3ED] hover:text-[#146B52] transition-colors disabled:opacity-40"
                      >
                        +5
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
