import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { BranchSwitcher } from './BranchSwitcher'
import { ProfileMenu } from './ProfileMenu'

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 h-14 bg-surface border-b border-border px-6 flex items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-3">
        <BranchSwitcher />
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        <ProfileMenu />
      </div>
    </header>
  )
}
