import { Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

export function SettingsPage() {
  const handleSave = () => {
    toast.success('Созламалар сақланди!')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
          Марказ созламалари
        </h1>
        <p className="text-xs text-[#65776C] mt-0.5">
          Ўқув маркази номи, контактлари ва умумий қоидалар
        </p>
      </div>

      <div className="bg-white border border-[#E3EAE5] rounded-lg p-6 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Ўқув маркази номи
          </label>
          <Input defaultValue="Zucco Academy" />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Асосий телефон рақами
          </label>
          <Input defaultValue="+998 (71) 200-00-20" />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Юридик манзил
          </label>
          <Input defaultValue="Тошкент ш., Чилонзор тумани, 9-мавзе, 12-уй" />
        </div>

        <div className="pt-4 border-t border-[#E3EAE5] flex justify-end">
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save className="w-3.5 h-3.5" />
            <span>Ўзгаришларни сақлаш</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
