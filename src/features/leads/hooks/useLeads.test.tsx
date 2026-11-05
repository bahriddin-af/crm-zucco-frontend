import { act, renderHook, waitFor } from '@testing-library/react'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { createQueryWrapper, createTestQueryClient } from '@/test/renderWithProviders'
import { useMoveLeadStage } from './useLeads'
import { leadApi } from '../api/leadApi'
import { LEAD_STAGE_TYPE, LEAD_STATUS, type KanbanColumn } from '../types/leadTypes'

vi.mock('../api/leadApi', () => ({
  leadApi: { moveStage: vi.fn() },
}))

const lead = {
  id: 'lead-1',
  fullName: 'Aziz Karimov',
  phone: '+998901112233',
  stageId: 'stage-new',
  stageName: 'New',
  status: LEAD_STATUS.Active,
  createdAt: '2026-11-01T10:00:00Z',
}

const board: KanbanColumn[] = [
  { stageId: 'stage-new', stageName: 'New', order: 1, stageType: LEAD_STAGE_TYPE.NewLead, totalLeads: 1, leads: [lead] },
  { stageId: 'stage-contacted', stageName: 'Contacted', order: 2, stageType: LEAD_STAGE_TYPE.Contacted, totalLeads: 0, leads: [] },
]

const kanbanKey = QUERY_KEYS.LEADS.KANBAN(undefined)

function deferred() {
  let resolve: (value: unknown) => void = () => undefined
  let reject: (reason: unknown) => void = () => undefined
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const setup = () => {
  const queryClient = createTestQueryClient()
  queryClient.setQueryData(kanbanKey, board)
  const { result } = renderHook(() => useMoveLeadStage(), { wrapper: createQueryWrapper(queryClient) })
  const readBoard = () => queryClient.getQueryData<KanbanColumn[]>(kanbanKey)
  return { result, readBoard }
}

describe('useMoveLeadStage', () => {
  beforeEach(() => {
    vi.mocked(leadApi.moveStage).mockReset()
  })

  it('moves the lead optimistically before the server answers', async () => {
    const request = deferred()
    vi.mocked(leadApi.moveStage).mockReturnValue(request.promise as ReturnType<typeof leadApi.moveStage>)
    const { result, readBoard } = setup()

    act(() => result.current.mutate({ leadId: 'lead-1', targetStageId: 'stage-contacted' }))

    await waitFor(() => {
      const [newColumn, contactedColumn] = readBoard() ?? []
      expect(newColumn.leads).toHaveLength(0)
      expect(newColumn.totalLeads).toBe(0)
      expect(contactedColumn.leads.map((item) => item.id)).toEqual(['lead-1'])
      expect(contactedColumn.leads[0].stageName).toBe('Contacted')
      expect(contactedColumn.totalLeads).toBe(1)
    })
    expect(leadApi.moveStage).toHaveBeenCalledWith({ leadId: 'lead-1', targetStageId: 'stage-contacted' })

    act(() => request.resolve({ success: true, code: 'lead_stage_updated', data: null }))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('rolls the board back to the snapshot when the server rejects the move', async () => {
    const request = deferred()
    vi.mocked(leadApi.moveStage).mockReturnValue(request.promise as ReturnType<typeof leadApi.moveStage>)
    const { result, readBoard } = setup()

    act(() => result.current.mutate({ leadId: 'lead-1', targetStageId: 'stage-contacted' }))
    await waitFor(() => expect(readBoard()?.[1].leads).toHaveLength(1))

    act(() => request.reject(new Error('server error')))

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(readBoard()).toEqual(board)
  })
})
