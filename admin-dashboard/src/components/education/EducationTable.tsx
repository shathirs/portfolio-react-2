import { ChevronDown, ChevronUp, ExternalLink, GraduationCap, Pencil, Trash2 } from 'lucide-react'
import { hasUrl } from '@/lib/hasUrl'
import { useState } from 'react'
import { EducationFormModal } from '@/components/education/EducationFormModal'
import { Modal } from '@/components/ui/Modal'
import { useEducation } from '@/context/EducationContext'
import type { Education } from '@/types'

export function EducationTable() {
  const { entries, deleteEntry, moveEntry } = useEducation()
  const [formEntry, setFormEntry] = useState<Education | 'new' | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null)

  const editingEntry = formEntry && formEntry !== 'new' ? formEntry : null

  return (
    <>
      {entries.length === 0 ? (
        <p className="rounded-xl border border-border bg-white px-6 py-12 text-center text-sm text-muted">
          No education entries yet. Add your academic background for the portfolio site.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <ul className="divide-y divide-border">
            {entries.map((entry, index) => (
              <li
                key={entry.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-6"
              >
                <div className="flex shrink-0 items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-primary">
                    <GraduationCap className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div className="flex flex-col gap-0.5 sm:hidden">
                    <span className="text-xs font-medium text-muted">Order {entry.order}</span>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{entry.degree}</h3>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-primary">
                      {entry.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-700">{entry.institution}</p>
                  {entry.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted">{entry.description}</p>
                  ) : null}
                  {hasUrl(entry.liveDemoUrl) ? (
                    <a
                      href={entry.liveDemoUrl.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
                    >
                      Live Demo
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  <p className="mt-2 hidden text-xs text-muted sm:block">
                    Display order: {entry.order}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1 self-end sm:self-start">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveEntry(entry.id, 'up')}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    disabled={index === entries.length - 1}
                    onClick={() => moveEntry(entry.id, 'down')}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormEntry(entry)}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-indigo-50 hover:text-primary"
                    aria-label={`Edit ${entry.degree}`}
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(entry)}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${entry.degree}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <EducationFormModal
        open={formEntry !== null}
        entry={editingEntry}
        onClose={() => setFormEntry(null)}
      />

      <Modal
        open={!!deleteTarget}
        title="Delete education entry?"
        description={
          deleteTarget
            ? `"${deleteTarget.degree}" will be removed from your portfolio.`
            : undefined
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await deleteEntry(deleteTarget.id)
          setDeleteTarget(null)
        }}
        confirmLabel="Delete"
      />
    </>
  )
}
