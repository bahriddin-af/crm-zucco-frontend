import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Phone,
  Coins,
  PauseCircle,
  UserCheck,
} from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { StudentFreezeModal } from '../components/StudentFreezeModal'
import { StudentEnrollModal } from '../components/StudentEnrollModal'
import { formatCurrency, formatPhone, formatDate } from '@/utils/formatters'
import {
  STUDENT_STATUS,
  STUDENT_STATUS_LABELS,
} from '../types/studentTypes'
import { useStudentDetail, useUnfreezeStudent } from '../hooks/useStudents'

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: student, isLoading, isError } = useStudentDetail(id || '')
  const unfreezeMutation = useUnfreezeStudent()

  const [isFreezeOpen, setIsFreezeOpen] = useState(false)
  const [isEnrollOpen, setIsEnrollOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !student) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-[#E3EAE5] space-y-3">
        <p className="text-xs text-red-600">Талаба маълумотлари топилмади ёки юклашда хатолик юз берди</p>
        <Link to={ROUTES.STUDENTS.LIST}>
          <Button variant="secondary" size="sm">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Рўйхатга қайтиш</span>
          </Button>
        </Link>
      </div>
    )
  }

  const isDebtor = student.balance < 0
  const isFrozen = student.status === STUDENT_STATUS.Frozen

  return (
    <div className="space-y-5">
      {/* Back button */}
      <div>
        <Link
          to={ROUTES.STUDENTS.LIST}
          className="inline-flex items-center gap-1.5 text-xs text-[#65776C] hover:text-[#146B52] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Талабалар рўйхатига қайтиш</span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white border border-[#E3EAE5] rounded-xl p-6 shadow-xs flex flex-col md:flex-row justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[#E8F3ED] text-[#146B52] border border-[#BBDCCB] flex items-center justify-center text-xl font-bold">
            {student.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold text-[#1E2B24]">{student.fullName}</h1>
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
            </div>
            <div className="flex items-center gap-2 text-xs text-[#65776C]">
              <Phone className="w-3.5 h-3.5 text-[#8B9C91]" />
              <span className="tabular-nums font-medium">{formatPhone(student.phone)}</span>
            </div>
            {student.address && (
              <p className="text-xs text-[#8B9C91]">Манзил: {student.address}</p>
            )}
          </div>
        </div>

        {/* Quick Balance & Coin Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 bg-[#F6F8F7] border border-[#E3EAE5] rounded-lg min-w-[140px]">
            <span className="block text-[10px] text-[#65776C] font-medium">Баланс:</span>
            <span
              className={`text-base font-bold tabular-nums ${
                isDebtor ? 'text-[#BE123C]' : 'text-[#047857]'
              }`}
            >
              {formatCurrency(student.balance)}
            </span>
          </div>

          <div className="p-3 bg-[#F6F8F7] border border-[#E3EAE5] rounded-lg min-w-[120px]">
            <span className="block text-[10px] text-[#65776C] font-medium">Тангалар:</span>
            <div className="flex items-center gap-1 text-base font-bold text-[#B45309] tabular-nums">
              <Coins className="w-4 h-4 text-[#F59E0B]" />
              <span>{student.coinsBalance}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEnrollOpen(true)}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>+ Гуруҳга қўшиш</span>
            </Button>
            {isFrozen ? (
              <Button
                variant="outline"
                size="sm"
                isLoading={unfreezeMutation.isPending}
                onClick={() => unfreezeMutation.mutate(student.id)}
              >
                <span>Қайта фаоллаштириш</span>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFreezeOpen(true)}
              >
                <PauseCircle className="w-3.5 h-3.5" />
                <span>Музлатиш</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Enrolled Groups */}
      <div className="bg-white border border-[#E3EAE5] rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#1E2B24]">
          Қатнашаётган ўқув гуруҳлари ({student.enrolledGroups.length})
        </h3>

        {student.enrolledGroups.length === 0 ? (
          <p className="text-xs text-[#8B9C91] py-4">
            Талаба ҳозирча ҳеч қандай гуруҳга аъзо эмас. «Гуруҳга қўшиш» тугмасини босинг.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {student.enrolledGroups.map((g) => (
              <div
                key={g.groupId}
                className="p-3.5 bg-[#F6F8F7] border border-[#E3EAE5] rounded-lg space-y-2 hover:border-[#BBDCCB] transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-[#1E2B24]">{g.groupName}</h4>
                    <p className="text-[11px] text-[#65776C]">{g.courseName}</p>
                  </div>
                  <span className="text-[10px] bg-[#E8F3ED] text-[#146B52] font-semibold px-2 py-0.5 rounded">
                    Ўқитувчи: {g.teacherName}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#4D6255] pt-1 border-t border-[#E3EAE5]">
                  <span>Қўшилган: {formatDate(g.joinedDate)}</span>
                  {g.customPrice && (
                    <span className="font-semibold text-[#146B52]">
                      Нархи: {formatCurrency(g.customPrice)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <StudentFreezeModal
        isOpen={isFreezeOpen}
        onClose={() => setIsFreezeOpen(false)}
        student={student}
      />

      <StudentEnrollModal
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        student={student}
      />
    </div>
  )
}
