import { NotificationBell } from '@/components/layout/NotificationBell'
import { ProfileMenu } from '@/components/layout/ProfileMenu'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-8">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <ProfileMenu />
      </div>
    </header>
  )
}
