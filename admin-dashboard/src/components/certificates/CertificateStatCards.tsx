import { Award, CheckCircle, FileEdit, Trash2 } from 'lucide-react'
import type { CertificateStats } from '@/types'

interface CertificateStatCardsProps {
  stats: CertificateStats
}

const cards = [
  {
    key: 'total' as const,
    label: 'Total Certificates',
    icon: Award,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-primary',
  },
  {
    key: 'published' as const,
    label: 'Published',
    icon: CheckCircle,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    key: 'draft' as const,
    label: 'Drafts',
    icon: FileEdit,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    key: 'deleted' as const,
    label: 'Deleted',
    icon: Trash2,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
]

export function CertificateStatCards({ stats }: CertificateStatCardsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, iconBg, iconColor }) => (
        <div
          key={key}
          className="rounded-xl border border-border bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">{label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stats[key]}</p>
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
      ))}
    </div>
  )
}
