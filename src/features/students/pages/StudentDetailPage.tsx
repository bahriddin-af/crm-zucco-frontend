import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Phone,
  Coins,
  CreditCard,
  PauseCircle,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StudentFreezeModal } from '../components/StudentFreezeModal'
import { StudentEnrollModal } from '../components/StudentEnrollModal'
import { formatCurrency, formatPhone, formatDate } from '@/utils/formatters'
import type { Student } from '../types/studentTypes'

const MOCK_STUDENT: Student = {
  id: 'zu-0248',
  fullName: 'Темур Бекмирзаев',
  phone: '998901234567',
  code: 'ZU-0248',
  status: 'Active',
  balance: -450000,
  coins: 135,
  branchId: 'b1',
  branchName: 'Чилонзор филиали',
  parentPhone: '998907654321',
  notes: 'IELTS imtihoniga tayyorgarlik ko‘rmoqda. Maqsad: 7.5+',
  enrollments: [
    {
      id: 'e1',
      groupId: 'g1',
      groupName: 'IF-09',
      courseName: 'IELTS Foundation',
      joinedDate: '2026-09-01',
      standardPrice: 650000,
      customPrice: 600000,
      status: 'Active',
    },
    {
      id: 'e2',
      groupId: 'g2',
      groupName: 'GE-04',
      courseName: 'General English Conversation',
      joinedDate: '2026-10-15',
      standardPrice: 400000,
      status: 'Active',
    },
  ],
}

export function StudentDetailPage() {
  const [student, setStudent] = useState<Student>(MOCK_STUDENT)
  const [activeTab, setActiveTab] = useState<'payments' | 'attendance' | 'coins' | 'timeline'>('payments')

  const [isFreezeOpen, setIsFreezeOpen] = useState(false)
  const [isEnrollOpen, setIsEnrollOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Back button and profile actions */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.STUDENTS.LIST}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#65776C] hover:text-[#146B52]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Талабалар рўйхатига қайтиш</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEnrollOpen(true)}
          >
            + Қўшимча гуруҳга ёзиш
          </Button>
          {student.status === 'Active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFreezeOpen(true)}
              className="text-[#92400E] border-[#FDE68A] hover:bg-[#FFFBEB]"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              <span>Музлатиш</span>
            </Button>
          )}
          <Link to={ROUTES.FINANCE.DESK}>
            <Button variant="primary" size="sm">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Тўлов қабул қилиш</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="p-6 bg-white border border-[#E3EAE5] rounded-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#D7EADF] text-[#0F5943] border border-[#BBDCCB] flex items-center justify-center text-xl font-bold">
            {student.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
                {student.fullName}
              </h1>
              <Badge variant={student.status === 'Active' ? 'success' : 'warning'}>
                {student.status === 'Active' ? 'Фаол ўқиётган' : 'Музлатилган'}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#65776C] mt-1.5">
              <span className="font-semibold text-[#146B52] bg-[#E8F3ED] px-2 py-0.5 rounded">
                {student.code}
              </span>
              <div className="flex items-center gap-1.5 tabular-nums">
                <Phone className="w-3 h-3 text-[#8B9C91]" />
                <span>{formatPhone(student.phone)}</span>
              </div>
              {student.parentPhone && (
                <div className="flex items-center gap-1.5 tabular-nums text-[#8B9C91]">
                  <span>Ота-онаси: {formatPhone(student.parentPhone)}</span>
                </div>
              )}
              <span>Филиал: {student.branchName}</span>
            </div>
          </div>
        </div>

        {/* Small quick status */}
        <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-[#E3EAE5]">
          <div className="text-right">
            <span className="text-[11px] text-[#65776C] block">Ҳозирги баланс</span>
            <span
              className={`text-xl font-bold tabular-nums ${
                student.balance < 0 ? 'text-[#BE123C]' : 'text-[#047857]'
              }`}
            >
              {formatCurrency(student.balance)}
            </span>
          </div>
          <div className="w-[1px] h-10 bg-[#E3EAE5]" />
          <div className="text-right">
            <span className="text-[11px] text-[#65776C] block">Тангалар</span>
            <div className="flex items-center justify-end gap-1 text-[#92400E] text-xl font-bold tabular-nums">
              <Coins className="w-4 h-4 text-[#D97706]" />
              <span>{student.coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Enrolled Groups + Details Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tabs & Content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-6 border-b border-[#E3EAE5] bg-white px-5 rounded-t-lg">
            {[
              { id: 'payments', label: 'Тўловлар тарихи' },
              { id: 'attendance', label: 'Давомат журнали' },
              { id: 'coins', label: 'Тангалар ва совғалар' },
              { id: 'timeline', label: 'Ҳаракатлар лентаси' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3.5 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#146B52] text-[#146B52] font-semibold'
                    : 'border-transparent text-[#65776C] hover:text-[#1E2B24]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#E3EAE5] rounded-b-lg p-5 shadow-xs">
            {activeTab === 'payments' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-[#65776C] mb-2">
                  <span>Охирги молиявий амаллар</span>
                  <Link
                    to={ROUTES.FINANCE.DESK}
                    className="text-[#146B52] hover:underline"
                  >
                    Кассага ўтиш →
                  </Link>
                </div>
                <div className="divide-y divide-[#F0F4F1]">
                  {[
                    {
                      date: '2026-10-05',
                      type: 'Тўлов қабул қилинди (Payme)',
                      group: 'IELTS Foundation',
                      amount: 600000,
                      isCredit: true,
                    },
                    {
                      date: '2026-10-01',
                      type: 'Ойлик ўқув тўлови ҳисобланди',
                      group: 'IELTS Foundation',
                      amount: -600000,
                      isCredit: false,
                    },
                    {
                      date: '2026-09-01',
                      type: 'Тўлов қабул қилинди (Нақд)',
                      group: 'IELTS Foundation',
                      amount: 600000,
                      isCredit: true,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="py-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[#1E2B24]">{item.type}</p>
                        <p className="text-[11px] text-[#8B9C91]">
                          {formatDate(item.date)} · {item.group}
                        </p>
                      </div>
                      <span
                        className={`font-semibold tabular-nums ${
                          item.isCredit ? 'text-[#047857]' : 'text-[#BE123C]'
                        }`}
                      >
                        {item.isCredit ? '+' : ''}
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-[#65776C]">
                  <span>Сўнгги дарслар давомати</span>
                  <span className="font-semibold text-[#047857]">Ўртача: 96%</span>
                </div>
                <div className="divide-y divide-[#F0F4F1]">
                  {[
                    { date: '2026-11-02', status: 'Қатнашди', coins: '+5', grade: '92/100' },
                    { date: '2026-10-31', status: 'Қатнашди', coins: '+5', grade: '88/100' },
                    { date: '2026-10-28', status: 'Узрли қолдирди', coins: '0', grade: '—' },
                    { date: '2026-10-26', status: 'Қатнашди', coins: '+5', grade: '95/100' },
                  ].map((row, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                        <span>{formatDate(row.date)}</span>
                        <Badge variant={row.coins !== '0' ? 'success' : 'warning'}>
                          {row.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 tabular-nums">
                        <span className="text-[11px] text-[#65776C]">Баҳо: {row.grade}</span>
                        <span className="text-[#92400E] font-medium">{row.coins} танга</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'coins' && (
              <div className="space-y-3">
                <p className="text-xs text-[#65776C]">
                  Талабада жами <strong>{student.coins} танга</strong> мавжуд. Тангаларни мукофотлар маркетида совғаларга алмаштириш мумкин.
                </p>
                <Link to={ROUTES.MARKET.ITEMS}>
                  <Button variant="secondary" size="sm">
                    Мукофотлар маркетига ўтиш →
                  </Button>
                </Link>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-3 text-xs text-[#65776C]">
                <p>2026-10-15: Қўшимча General English гуруҳига ёзилди.</p>
                <p>2026-09-01: IELTS Foundation гуруҳига қабул қилинди.</p>
                <p>2026-08-28: Лидлар воронкасидан муваффақиятли айлантирилди.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Enrolled Groups List */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[#1E2B24]">
                Ўқиётган гуруҳлари ({student.enrollments.length})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEnrollOpen(true)}
                className="text-[11px] text-[#146B52]"
              >
                + Қўшиш
              </Button>
            </div>

            <div className="space-y-3">
              {student.enrollments.map((enr) => (
                <div
                  key={enr.id}
                  className="p-3 bg-[#F6F8F7] border border-[#E3EAE5] rounded-md space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1E2B24]">
                      {enr.groupName} · {enr.courseName}
                    </span>
                    <Badge variant="success">Фаол</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#65776C]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#8B9C91]" />
                      <span>{formatDate(enr.joinedDate)} дан</span>
                    </div>
                    <span className="font-medium text-[#1E2B24] tabular-nums">
                      {formatCurrency(enr.customPrice || enr.standardPrice)} / ой
                    </span>
                  </div>
                  {enr.customPrice && (
                    <p className="text-[10px] text-[#047857]">
                      * Шахсий чегирмали нарх белгиланган
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Freeze Modal */}
      <StudentFreezeModal
        student={student}
        isOpen={isFreezeOpen}
        onClose={() => setIsFreezeOpen(false)}
        onSuccess={(data) => {
          setStudent((prev) => ({
            ...prev,
            status: 'Frozen',
            freezeInfo: data,
          }))
        }}
      />

      {/* Enroll Modal */}
      <StudentEnrollModal
        student={student}
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        onSuccess={(data) => {
          setStudent((prev) => ({
            ...prev,
            enrollments: [
              ...prev.enrollments,
              {
                id: `e-${Date.now()}`,
                groupId: data.groupId,
                groupName: 'Frontend React · FE-02',
                courseName: 'Frontend React',
                joinedDate: data.joinedDate,
                standardPrice: 700000,
                customPrice: data.customPrice,
                status: 'Active',
              },
            ],
          }))
        }}
      />
    </div>
  )
}
