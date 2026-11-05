import { useState } from 'react'
import { DoorClosed, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { SectionCard } from '@/components/ui/SectionCard'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { useDeleteRoom, useRoomDetail, useRoomsList } from '../hooks/useBranches'
import { ROOMS_PAGE_SIZE, type BranchListItem, type RoomListItem } from '../types/branchTypes'
import { RoomFormModal } from './RoomFormModal'
import { RoomsTable } from './RoomsTable'

interface RoomsPanelProps {
  branch: BranchListItem
}

/** Tanlangan filial xonalari: ro'yxat, qo'shish/tahrirlash va o'chirish. */
export function RoomsPanel({ branch }: RoomsPanelProps) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null)
  const [roomToDelete, setRoomToDelete] = useState<RoomListItem | null>(null)
  const { data, isLoading, isError, error, refetch } = useRoomsList(branch.id, { page, pageSize: ROOMS_PAGE_SIZE })
  const editingRoom = useRoomDetail(branch.id, editingRoomId)
  const deleteRoom = useDeleteRoom()

  const confirmDelete = () => {
    if (!roomToDelete) return
    deleteRoom.mutate(
      { branchId: branch.id, roomId: roomToDelete.id },
      {
        onSuccess: () => toast.success(t.branches.roomDeleted),
        onSettled: () => setRoomToDelete(null),
      }
    )
  }

  const createButton = (
    <PermissionGuard permission={PERMISSIONS.ROOMS.CREATE}>
      <Button variant="secondary" size="sm" onClick={() => setIsCreating(true)}>
        <Plus className="w-3.5 h-3.5" />
        <span>{t.branches.newRoom}</span>
      </Button>
    </PermissionGuard>
  )

  return (
    <SectionCard title={interpolate(t.branches.roomsTitle, { branch: branch.name })} actions={createButton}>
      {isLoading && <ListSkeleton rows={4} />}
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
      {data && data.items.length === 0 && (
        <EmptyState icon={<DoorClosed className="w-5 h-5" />} title={t.branches.emptyRooms} action={createButton} />
      )}
      {data && data.items.length > 0 && (
        <>
          <RoomsTable
            rooms={data.items}
            loadingRoomId={editingRoom.isFetching ? editingRoomId : null}
            onEdit={(room) => setEditingRoomId(room.id)}
            onDelete={setRoomToDelete}
          />
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
      {editingRoom.isError && <ErrorState error={editingRoom.error} onRetry={() => void editingRoom.refetch()} />}

      {isCreating && <RoomFormModal branchId={branch.id} room={null} onClose={() => setIsCreating(false)} />}
      {editingRoom.data && editingRoom.data.id === editingRoomId && !editingRoom.isFetching && (
        <RoomFormModal branchId={branch.id} room={editingRoom.data} onClose={() => setEditingRoomId(null)} />
      )}
      <ConfirmDialog
        isOpen={roomToDelete !== null}
        isLoading={deleteRoom.isPending}
        onClose={() => setRoomToDelete(null)}
        onConfirm={confirmDelete}
        description={interpolate(t.branches.roomDeleteConfirm, { name: roomToDelete?.name ?? '' })}
      />
    </SectionCard>
  )
}
