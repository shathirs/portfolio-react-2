import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  subtitle?: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {subtitle ? <p className="mt-1 text-xs font-medium text-primary">{subtitle}</p> : null}
        </div>
        <div
          className={[
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
            iconBg,
          ].join(' ')}
        >
          <Icon className={['h-5 w-5', iconColor].join(' ')} strokeWidth={1.75} />
        </div>
      </div>
    </div>
  )
}
