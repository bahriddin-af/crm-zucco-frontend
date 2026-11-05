/** Backend `Zucco.Domain.Branches.Enums.BranchStatus`. */
export const BRANCH_STATUS = {
  Active: 1,
  Inactive: 2,
} as const

export type BranchStatus = (typeof BRANCH_STATUS)[keyof typeof BRANCH_STATUS]

/** Backend `RoomType`. */
export const ROOM_TYPE = {
  StandardClassroom: 1,
  ComputerLab: 2,
  ConferenceHall: 3,
  IndividualRoom: 4,
} as const

export type RoomType = (typeof ROOM_TYPE)[keyof typeof ROOM_TYPE]

export const BRANCHES_PAGE_SIZE = 12
export const ROOMS_PAGE_SIZE = 20

export interface BranchListItem {
  id: string
  name: string
  address: string | null
  phone: string | null
  isMain: boolean
  status: BranchStatus
  roomCount: number
}

export interface CreateOrUpdateBranchRequest {
  id: string | null
  name: string
  address: string | null
  phone: string | null
  isMain: boolean
  status: BranchStatus
}

export interface BranchesFilter {
  page: number
  pageSize: number
  search?: string
}

export interface RoomListItem {
  id: string
  branchId: string
  branchName: string
  name: string
  capacity: number
  type: RoomType
}

export interface RoomResponse extends RoomListItem {
  equipment: string | null
  createdAt: string
}

export interface CreateOrUpdateRoomRequest {
  id: string | null
  branchId: string
  name: string
  capacity: number
  type: RoomType
  equipment: string | null
}

export interface RoomsFilter {
  page: number
  pageSize: number
}
