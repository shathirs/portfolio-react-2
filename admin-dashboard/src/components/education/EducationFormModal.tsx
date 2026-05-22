import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import {
  emptyEducationInput,
  useEducation,
  type EducationInput,
} from '@/context/EducationContext'
import type { Education } from '@/types'

interface EducationFormModalProps {
  open: boolean
  entry: Education | null
  onClose: () => void
}

export function EducationFormModal({ open, entry, onClose }: EducationFormModalProps) {
  const { entries, addEntry, updateEntry } = useEducation()
  const [form, setForm] = useState<EducationInput>(emptyEducationInput())
  const [errors, setErrors] = useState<Partial<Record<keyof EducationInput, string>>>({})
  const [saving, setSaving] = useState(false)

  const isEdit = Boolean(entry)

  useEffect(() => {
    if (!open) return
    const nextOrder =
      entries.length > 0 ? Math.max(...entries.map((e) => e.order)) + 1 : 1
    setForm(
      entry
        ? {
            degree: entry.degree,
            institution: entry.institution,
            period: entry.period,
            description: entry.description,
            liveDemoUrl: entry.liveDemoUrl ?? '',
            order: entry.order,
          }
        : emptyEducationInput(nextOrder),
    )
    setErrors({})
  }, [open, entry, entries])

  if (!open) return null

  function validate() {
    const next: Partial<Record<keyof EducationInput, string>> = {}
    if (!form.degree.trim()) next.degree = 'Degree is required'
    if (!form.institution.trim()) next.institution = 'Institution is required'
    if (!form.period.trim()) next.period = 'Period is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      const payload: EducationInput = {
        degree: form.degree.trim(),
        institution: form.institution.trim(),
        period: form.period.trim(),
        description: form.description.trim(),
        liveDemoUrl: form.liveDemoUrl.trim(),
        order: Number(form.order) || 0,
      }
      if (isEdit && entry) {
        await updateEntry(entry.id, payload)
      } else {
        await addEntry(payload)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">
          {isEdit ? 'Edit education' : 'Add education'}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Shown on your portfolio education timeline. Lower order appears first.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Degree / qualification"
            value={form.degree}
            onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
            placeholder="BSc (Hons) in Software Engineering"
            error={errors.degree}
          />
          <Input
            label="Institution"
            value={form.institution}
            onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
            placeholder="University of Bedfordshire"
            error={errors.institution}
          />
          <Input
            label="Period"
            value={form.period}
            onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
            placeholder="2022 – 2025"
            error={errors.period}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Brief summary of your studies…"
            rows={4}
          />
          <Input
            label="Live demo link (optional)"
            type="url"
            value={form.liveDemoUrl}
            onChange={(e) => setForm((f) => ({ ...f, liveDemoUrl: e.target.value }))}
            placeholder="https://university.edu/program"
          />
          <p className="-mt-2 text-xs text-muted">
            Leave empty to hide the Live Demo button on your portfolio.
          </p>
          <Input
            label="Display order"
            type="number"
            min={0}
            value={String(form.order)}
            onChange={(e) =>
              setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))
            }
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add entry'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
