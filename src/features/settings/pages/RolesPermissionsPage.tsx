import { ShieldCheck } from 'lucide-react'
import { PERMISSIONS } from '@/constants/permissions'
import { Badge } from '@/components/ui/Badge'

interface RoleDefinition {
  id: string
  name: string
  description: string
  permissions: string[]
}

const ROLES: RoleDefinition[] = [
  {
    id: 'owner',
    name: 'Owner (Тизим раҳбари)',
    description: 'Барча молиявий, кадр ва бошқарув модулларига чекланмаган тўлиқ рухсат',
    permissions: ['*'],
  },
  {
    id: 'admin',
    name: 'Administrator (Менежер)',
    description: 'Лидлар, талабалар, гуруҳлар ва SMS марказини тўлиқ назорат қилиш',
    permissions: [
      PERMISSIONS.LEADS.VIEW,
      PERMISSIONS.LEADS.CREATE,
      PERMISSIONS.LEADS.CONVERT,
      PERMISSIONS.STUDENTS.VIEW,
      PERMISSIONS.STUDENTS.CREATE,
      PERMISSIONS.STUDENTS.FREEZE,
      PERMISSIONS.GROUPS.VIEW,
      PERMISSIONS.GROUPS.CREATE,
      PERMISSIONS.ATTENDANCE.VIEW,
      PERMISSIONS.NOTIFICATIONS.SMS_SEND,
    ],
  },
  {
    id: 'teacher',
    name: 'Teacher (Ўқитувчи)',
    description: 'Фақат ўз гуруҳлари, дарс жадвали ва давомат белгилашга рухсат',
    permissions: [
      PERMISSIONS.ATTENDANCE.VIEW,
      PERMISSIONS.ATTENDANCE.MARK,
      PERMISSIONS.ATTENDANCE.GRADE,
      PERMISSIONS.GROUPS.VIEW,
      PERMISSIONS.COURSES.VIEW,
    ],
  },
  {
    id: 'cashier',
    name: 'Cashier (Кассир)',
    description: 'Тўловларни қабул қилиш, чек чиқариш ва кундалик касса ҳисоби',
    permissions: [
      PERMISSIONS.FINANCE.VIEW,
      PERMISSIONS.FINANCE.PAYMENT_CREATE,
      PERMISSIONS.FINANCE.EXPENSE_CREATE,
      PERMISSIONS.STUDENTS.VIEW,
    ],
  },
]

export function RolesPermissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Роллар ва рухсатлар (RBAC)
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Тизимдаги лавозимлар ва уларга бириктирилган аниқ функционал ҳуқуқлар
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLES.map((role) => (
          <div
            key={role.id}
            className="bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs space-y-4 hover:border-[#BBDCCB] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#E8F3ED] text-[#146B52] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E2B24]">{role.name}</h3>
                  <p className="text-[11px] text-[#65776C]">{role.description}</p>
                </div>
              </div>
              <Badge variant="accent">Фаол роль</Badge>
            </div>

            <div className="pt-3 border-t border-[#F0F4F1] space-y-2">
              <h4 className="text-[11px] font-semibold text-[#8B9C91] uppercase tracking-wider">
                Асосий рухсатномалар:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.includes('*') ? (
                  <span className="text-[10px] bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] px-2 py-0.5 rounded font-semibold">
                    Барча тизим ҳуқуқлари (Full Access)
                  </span>
                ) : (
                  role.permissions.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] bg-[#F6F8F7] text-[#4D6255] border border-[#E3EAE5] px-2 py-0.5 rounded font-mono"
                    >
                      {p}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
