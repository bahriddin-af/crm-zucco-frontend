import { z } from 'zod'
import type { Translations } from '@/i18n'
import { BRANCH_STATUS, ROOM_TYPE } from './branchTypes'

/** Backend `Branch.Create/Update`: Guard.Text(name), Guard.Defined(status); manzil va telefon ixtiyoriy. */
export const createBranchSchema = (t: Translations) =>
  z.object({
    name: z.string().trim().min(1, t.branches.validation.nameRequired),
    address: z.string().trim(),
    phone: z.string().trim(),
    isMain: z.boolean(),
    status: z.enum(BRANCH_STATUS, { error: t.branches.validation.statusRequired }),
  })

export type BranchFormValues = z.infer<ReturnType<typeof createBranchSchema>>

/** Backend `Room.Create/Update`: Guard.Text(name), Guard.Positive(capacity), Guard.Defined(type). */
export const createRoomSchema = (t: Translations) =>
  z.object({
    name: z.string().trim().min(1, t.branches.validation.roomNameRequired),
    capacity: z
      .number({ error: t.branches.validation.capacityPositive })
      .int(t.branches.validation.capacityPositive)
      .positive(t.branches.validation.capacityPositive),
    type: z.enum(ROOM_TYPE, { error: t.branches.validation.typeRequired }),
    equipment: z.string().trim(),
  })

export type RoomFormValues = z.infer<ReturnType<typeof createRoomSchema>>
