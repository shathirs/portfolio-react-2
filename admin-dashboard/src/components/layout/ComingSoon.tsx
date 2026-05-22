import type { LucideIcon } from 'lucide-react'

interface ComingSoonProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
}

export function ComingSoon({ icon: Icon, title, description, features }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-border bg-white p-10 shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-primary">
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <h2 className="mt-6 text-center text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-center text-sm text-muted">{description}</p>
      <div className="mt-8 rounded-lg bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Planned for backend phase
        </p>
        <ul className="mt-3 space-y-2">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-slate-700"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        Connect the MERN API to enable full CRUD for this section.
      </p>
    </div>
  )
}
