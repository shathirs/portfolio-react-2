import type { ReactNode } from 'react'

type BadgeVariant = 'published' | 'draft' | 'deleted' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  dot?: boolean
}

const styles: Record<BadgeVariant, string> = {
  published: 'bg-emerald-50 text-emerald-700',
  draft: 'bg-amber-50 text-amber-800',
  deleted: 'bg-red-50 text-red-700',
  default: 'bg-indigo-50 text-primary',
}

const dotColors: Record<BadgeVariant, string> = {
  published: 'bg-emerald-500',
  draft: 'bg-amber-500',
  deleted: 'bg-red-500',
  default: 'bg-primary',
}

export function Badge({ variant = 'default', children, dot }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        styles[variant],
      ].join(' ')}
    >
      {dot ? (
        <span className={['h-1.5 w-1.5 rounded-full', dotColors[variant]].join(' ')} />
      ) : null}
      {children}
    </span>
  )
}
