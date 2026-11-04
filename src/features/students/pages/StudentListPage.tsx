import { useState } from 'react'
import { Plus, Search, Coins, ChevronRight, PauseCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StudentFreezeModal } from '../components/StudentFreezeModal'
import { StudentEnrollModal } from '../components/StudentEnrollModal'
import { formatCurrency, formatPhone } from '@/utils/formatters'
import { useTranslation } from '@/i18n'
import type { Student } from '../types/studentTypes'

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'zu-0248',
    fullName: 'Темур Бекмирзаев',
    phone: '998901234567',
    code: 'ZU-0248',
    status: 'Active',
    balance: -450000,
    coins: 135,
    branchId: 'b1',
    branchName: 'Чилонзор',
    enrollments: [
      {
        id: 'e1',
        groupId: 'g1',
        groupName: 'IF-09',
        courseName: 'IELTS Foundation',
        joinedDate: '2026-09-01',
        standardPrice: 650000,
        status: 'Active',
      },
    ],
  },
  {
    id: 'zu-0189',
    fullName: 'Шаҳзода Низомова',
    phone: '998939871122',
    code: 'ZU-0189',
    status: 'Active',
    balance: 200000,
    coins: 210,
    branchId: 'b1',
    branchName: 'Чилонзор',
    enrollments: [
      {
        id: 'e2',
        groupId: 'g2',
        groupName: 'GE-04',
        courseName: 'General English',
        joinedDate: '2026-08-15',
        standardPrice: 500000,
        status: 'Active',
      },
      {
        id: 'e3',
        groupId: 'g3',
        groupName: 'FE-02',
        courseName: 'Frontend React',
        joinedDate: '2026-10-01',
        standardPrice: 800000,
        status: 'Active',
      },
    ],
  },
  {
    id: 'zu-0312',
    fullName: 'Жаҳонгир Олимов',
    phone: '998973334455',
    code: 'ZU-0312',
    status: 'Frozen',
    balance: 0,
    coins: 45,
    branchId: 'b1',
    branchName: 'Чилонзор',
    enrollments: [
      {
        id: 'e4',
        groupId: 'g1',
        groupName: 'IF-09',
        courseName: 'IELTS Foundation',
        joinedDate: '2026-07-10',
        standardPrice: 650000,
        status: 'Frozen',
      },
    ],
    freezeInfo: {
      startDate: '2026-10-20',
      endDate: '2026-11-20',
      reason: 'Саломатлик туфайли',
    },
  },
  {
    id: 'zu-0155',
    fullName: 'Камила Исмоилова',
    phone: '998998887766',
    code: 'ZU-0155',
    status: 'Active',
    balance: 0,
    coins: 90,
    branchId: 'b1',
    branchName: 'Чилонзор',
    enrollments: [
      {
        id: 'e5',
        groupId: 'g4',
        groupName: 'M-11',
        courseName: 'Matematika Intensive',
        joinedDate: '2026-09-15',
        standardPrice: 400000,
        status: 'Active',
      },
    ],
  },
]

export function StudentListPage() {
  const { t } = useTranslation()
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Frozen' | 'Debt'>('All')

  const [selectedFreezeStudent, setSelectedFreezeStudent] = useState<Student | null>(null)
  const [selectedEnrollStudent, setSelectedEnrollStudent] = useState<Student | null>(null)

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)

    if (!matchesSearch) return false

    if (statusFilter === 'Active') return s.status === 'Active'
    if (statusFilter === 'Frozen') return s.status === 'Frozen'
    if (statusFilter === 'Debt') return s.balance < 0

    return true
  })

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            {t.students.title}
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            {t.students.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" />
            <span>{t.students.addNew}</span>
          </Button>
        </div>
      </div>

      {/* Toolbar / Search / Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E3EAE5] shadow-xs">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B9C91]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.students.searchPlaceholder}
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F6F8F7] border border-[#E3EAE5] rounded-md text-[#1E2B24] placeholder:text-[#8B9C91] focus:outline-none focus:ring-1 focus:ring-[#146B52]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { key: 'All', label: t.common.all },
            { key: 'Active', label: t.common.active },
            { key: 'Frozen', label: t.common.frozen },
            { key: 'Debt', label: t.common.debt },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key as typeof statusFilter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === tab.key
                  ? 'bg-[#146B52] text-white'
                  : 'bg-[#F6F8F7] text-[#4D6255] hover:bg-[#E8F3ED]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F6F8F7] border-b border-[#E3EAE5] text-[#65776C] text-[11px] font-semibold">
                <th className="py-3 px-4">{t.students.codeOrName}</th>
                <th className="py-3 px-4">{t.common.phone}</th>
                <th className="py-3 px-4">{t.students.enrolledGroups}</th>
                <th className="py-3 px-4">{t.students.balance}</th>
                <th className="py-3 px-4">{t.students.coins}</th>
                <th className="py-3 px-4">{t.common.status}</th>
                <th className="py-3 px-4 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F1]">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-[#FCFEFC] transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <Link
                      to={`/students/${student.id}`}
                      className="font-semibold text-[#1E2B24] hover:text-[#146B52] hover:underline block"
                    >
                      {student.fullName}
                    </Link>
                    <span className="text-[10px] text-[#8B9C91]">{student.code}</span>
                  </td>

                  <td className="py-3.5 px-4 text-[#4D6255] tabular-nums">
                    {formatPhone(student.phone)}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {student.enrollments.map((enr) => (
                        <span
                          key={enr.id}
                          className="text-[10px] bg-[#EFF7F1] text-[#176446] border border-[#DDEEE3] px-1.5 py-0.5 rounded font-medium"
                        >
                          {enr.groupName}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 tabular-nums">
                    {student.balance < 0 ? (
                      <span className="text-[#BE123C] font-semibold bg-[#FFF1F2] px-2 py-0.5 rounded">
                        {formatCurrency(student.balance)}
                      </span>
                    ) : student.balance > 0 ? (
                      <span className="text-[#047857] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded">
                        +{formatCurrency(student.balance)}
                      </span>
                    ) : (
                      <span className="text-[#65776C]">0 {t.common.sumUnit}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 tabular-nums">
                    <div className="flex items-center gap-1 text-[#92400E] font-medium">
                      <Coins className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{student.coins}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {student.status === 'Active' && (
                      <Badge variant="success">{t.common.active}</Badge>
                    )}
                    {student.status === 'Frozen' && (
                      <Badge variant="warning">{t.common.frozen}</Badge>
                    )}
                    {student.status === 'Departed' && (
                      <Badge variant="default">Чиққан</Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEnrollStudent(student)}
                        title={t.students.enrollGroup}
                        className="text-[11px]"
                      >
                        {t.students.enrollGroup}
                      </Button>
                      {student.status === 'Active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFreezeStudent(student)}
                          title={t.students.freeze}
                          className="text-[11px] text-[#92400E]"
                        >
                          <PauseCircle className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Link to={`/students/${student.id}`}>
                        <Button variant="secondary" size="sm" className="p-1.5">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8B9C91]">
                    {t.common.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Freeze Modal */}
      <StudentFreezeModal
        student={selectedFreezeStudent}
        isOpen={Boolean(selectedFreezeStudent)}
        onClose={() => setSelectedFreezeStudent(null)}
        onSuccess={() => {
          if (!selectedFreezeStudent) return
          setStudents((prev) =>
            prev.map((s) =>
              s.id === selectedFreezeStudent.id ? { ...s, status: 'Frozen' } : s
            )
          )
        }}
      />

      {/* Enroll Modal */}
      <StudentEnrollModal
        student={selectedEnrollStudent}
        isOpen={Boolean(selectedEnrollStudent)}
        onClose={() => setSelectedEnrollStudent(null)}
        onSuccess={(data) => {
          if (!selectedEnrollStudent) return
          setStudents((prev) =>
            prev.map((s) =>
              s.id === selectedEnrollStudent.id
                ? {
                    ...s,
                    enrollments: [
                      ...s.enrollments,
                      {
                        id: `e-${Date.now()}`,
                        groupId: data.groupId,
                        groupName: data.groupId === 'g2' ? 'GE-04' : 'FE-02',
                        courseName: data.groupId === 'g2' ? 'General English' : 'Frontend React',
                        joinedDate: data.joinedDate,
                        standardPrice: 600000,
                        customPrice: data.customPrice,
                        status: 'Active',
                      },
                    ],
                  }
                : s
            )
          )
        }}
      />
    </div>
  )
}
