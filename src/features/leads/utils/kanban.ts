import type { KanbanColumn } from '../types/leadTypes'

/**
 * Lidni bir ustundan boshqasiga ko'chirilgan holatdagi yangi doska (optimistik yangilash uchun).
 * Lid topilmasa yoki allaqachon shu bosqichda bo'lsa, doska o'zgarmaydi.
 */
export function moveLeadBetweenColumns(
  columns: KanbanColumn[],
  leadId: string,
  targetStageId: string
): KanbanColumn[] {
  const source = columns.find((column) => column.leads.some((lead) => lead.id === leadId))
  const target = columns.find((column) => column.stageId === targetStageId)
  const lead = source?.leads.find((item) => item.id === leadId)

  if (!source || !target || !lead || source.stageId === targetStageId) return columns

  const movedLead = { ...lead, stageId: target.stageId, stageName: target.stageName }

  return columns.map((column) => {
    if (column.stageId === source.stageId) {
      return {
        ...column,
        totalLeads: Math.max(0, column.totalLeads - 1),
        leads: column.leads.filter((item) => item.id !== leadId),
      }
    }
    if (column.stageId === target.stageId) {
      return { ...column, totalLeads: column.totalLeads + 1, leads: [movedLead, ...column.leads] }
    }
    return column
  })
}

/** Qidiruv bo'yicha mijoz tomonida filtrlash (kanban endpointida qidiruv yo'q). */
export function filterColumnLeads(column: KanbanColumn, search: string) {
  const query = search.trim().toLowerCase()
  if (!query) return column.leads
  return column.leads.filter(
    (lead) =>
      lead.fullName.toLowerCase().includes(query) ||
      lead.phone.includes(query) ||
      Boolean(lead.courseName?.toLowerCase().includes(query))
  )
}
