import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, Shield, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPhone } from '@/utils/formatters'
import { StaffModal } from '../components/StaffModal'
import { useStaffList, useDeleteStaff } from '../hooks/useStaff'
import {
  STAFF_ROLE_LABELS,
  type StaffListItem,
  type StaffRoleType,
} from '../types/staffTypes'

export function StaffListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<StaffRoleType | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffListItem | null>(null)

  const { data, isLoading } = useStaffList(1, 50, searchTerm, selectedRole)
  const deleteMutation = useDeleteStaff()

  const staffList = data?.items || []

  const handleEdit = (staff: StaffListItem) => {
    setEditingStaff(staff)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingStaff(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Ҳақиқатдан ҳам ${name} ни тизимдан ўчирмоқчимисиз?`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Ходимлар ва ўқитувчилар
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Марказ ходимлари, уларнинг лавозими, роллари ва филиалларга бириктирилиши
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleAdd}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Янги ходим қўшиш</span>
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-[#E3EAE5] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8C9E94] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Исм ёки телефон бўйича қидириш..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E5E9EB] text-xs text-[#1E2B24] placeholder:text-[#8C9E94] focus:outline-hidden focus:border-[#027A48] focus:ring-1 focus:ring-[#027A48]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedRole(undefined)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedRole === undefined
                ? 'bg-[#027A48] text-white'
                : 'bg-[#F0F3F1] text-[#5A6C62] hover:bg-[#E5E9EB]'
            }`}
          >
            Барчаси ({staffList.length})
          </button>
          {Object.entries(STAFF_ROLE_LABELS).map(([key, label]) => {
            const roleNum = Number(key) as StaffRoleType
            return (
              <button
                key={key}
                onClick={() => setSelectedRole(roleNum)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedRole === roleNum
                    ? 'bg-[#027A48] text-white'
                    : 'bg-[#F0F3F1] text-[#5A6C62] hover:bg-[#E5E9EB]'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-[#E3EAE5] rounded-xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-[#F8FAF9] rounded animate-pulse" />
            ))}
          </div>
        ) : staffList.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#027A48]/10 text-[#027A48] flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#1E2B24]">Ходимлар топилмади</h3>
            <p className="text-xs text-[#5A6C62] mt-1 max-w-sm mx-auto">
              Қидирув мезонларига мос ходимлар мавжуд эмас ёки ҳали янги ходим қўшилмаган.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F6F8F7] border-b border-[#E3EAE5] text-[#65776C] text-[11px] font-semibold">
                  <th className="py-3 px-4">Ф.И.Ш</th>
                  <th className="py-3 px-4">Телефон</th>
                  <th className="py-3 px-4">Лавозим / Роль</th>
                  <th className="py-3 px-4">Мутахассислик</th>
                  <th className="py-3 px-4">Филиал</th>
                  <th className="py-3 px-4">Ҳолати</th>
                  <th className="py-3 px-4 text-right">Амаллар</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F1]">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-[#FCFEFC] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1E2B24]">{staff.fullName}</div>
                      <div className="text-[11px] text-[#8C9E94] flex items-center gap-1 mt-0.5">
                        <Shield className="w-3 h-3" />
                        {staff.roles.join(', ') || 'Ходим'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-[#4D6255]">
                      {formatPhone(staff.phone)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="accent">
                        {STAFF_ROLE_LABELS[staff.roleType] || 'Ходим'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-[#5A6C62]">
                      {staff.specialization || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-[#65776C]">
                      {staff.branchName || 'Асосий филиал'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success">Фаол</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(staff)}
                          className="p-1.5 text-[#5A6C62] hover:text-[#027A48] hover:bg-[#F0F3F1] rounded-md transition-colors"
                          title="Таҳрирлаш"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(staff.id, staff.fullName)}
                          className="p-1.5 text-[#5A6C62] hover:text-[#E11D48] hover:bg-[#FEE2E2] rounded-md transition-colors"
                          title="Ўчириш"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialStaff={editingStaff}
      />
    </div>
  )
}
