import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import type { RoomListItem } from '../types/branchTypes'

interface RoomsTableProps {
  rooms: RoomListItem[]
  /** Tahrirlash uchun tafsilotlari yuklanayotgan xona. */
  loadingRoomId: string | null
  onEdit: (room: RoomListItem) => void
  onDelete: (room: RoomListItem) => void
}

export function RoomsTable({ rooms, loadingRoomId, onEdit, onDelete }: RoomsTableProps) {
  const { t } = useTranslation()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-canvas border-b border-border text-caption text-2xs font-semibold">
            <th className="py-2.5 px-3">{t.branches.roomName}</th>
            <th className="py-2.5 px-3">{t.branches.roomType}</th>
            <th className="py-2.5 px-3 text-right">{t.branches.capacity}</th>
            <th className="py-2.5 px-3 text-right">{t.common.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-divider">
          {rooms.map((room) => (
            <tr key={room.id} className="hover:bg-surface-tint transition-colors">
              <td className="py-2.5 px-3 font-semibold text-heading">{room.name}</td>
              <td className="py-2.5 px-3 text-copy-strong">{t.branches.roomTypes[room.type]}</td>
              <td className="py-2.5 px-3 text-right tabular-nums">{room.capacity}</td>
              <td className="py-2.5 px-3">
                <div className="flex items-center justify-end gap-1">
                  <PermissionGuard permission={PERMISSIONS.ROOMS.UPDATE}>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t.branches.editRoom}
                      isLoading={loadingRoomId === room.id}
                      onClick={() => onEdit(room)}
                    >
                      {loadingRoomId !== room.id && <Pencil className="w-3.5 h-3.5" />}
                    </Button>
                  </PermissionGuard>
                  <PermissionGuard permission={PERMISSIONS.ROOMS.DELETE}>
                    <Button variant="ghost" size="icon" aria-label={t.common.delete} onClick={() => onDelete(room)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </PermissionGuard>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
