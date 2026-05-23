import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { CertificateImagePicker } from '@/components/certificates/CertificateImagePicker'
import {
  certificateCategories,
  certificateStatuses,
} from '@/config/certificateCategories'
import { useCertificates } from '@/context/CertificatesContext'
import {
  certificateToFormState,
  emptyCertificateFormState,
  formStateToPayload,
  type CertificateFormState,
} from '@/lib/certificateForm'
import type { Certificate, CertificateStatus } from '@/types'

interface CertificateFormModalProps {
  open: boolean
  certificate: Certificate | null
  onClose: () => void
}

export function CertificateFormModal({
  open,
  certificate,
  onClose,
}: CertificateFormModalProps) {
  const { addCertificate, updateCertificate } = useCertificates()
  const [form, setForm] = useState<CertificateFormState>(emptyCertificateFormState())
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [saving, setSaving] = useState(false)

  const isEdit = Boolean(certificate?.id)

  useEffect(() => {
    if (!open) return
    setForm(certificate ? certificateToFormState(certificate) : emptyCertificateFormState())
    setErrors({})
  }, [open, certificate])

  if (!open) return null

  function updateField<K extends keyof CertificateFormState>(
    key: K,
    value: CertificateFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (!form.issuer.trim()) next.issuer = 'Issuer is required'
    const thumb = form.thumbnail.trim()
    if (
      thumb &&
      (thumb.includes('hyperstack.id/credential') ||
        (thumb.includes('/credential/') && !thumb.startsWith('/uploads/')))
    ) {
      next.thumbnail =
        'Use Credential URL for verify links. Upload an image/PDF or paste a file link here.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    setErrors({})

    try {
      const payload = formStateToPayload(form)
      if (isEdit && certificate) {
        await updateCertificate(certificate.id, payload)
      } else {
        await addCertificate(payload)
      }
      onClose()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save certificate.'
      setErrors({ form: message })
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
        aria-label="Close"
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">
          {isEdit ? 'Edit Certificate' : 'Add New Certificate'}
        </h3>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {errors.form ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.form}
            </p>
          ) : null}

          <Input
            label="Certificate Title"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="NextGenAI App Bootcamp"
            error={errors.title}
          />
          <Input
            label="Subtitle"
            value={form.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Professional Certificate"
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) =>
              updateField('category', e.target.value as CertificateFormState['category'])
            }
            options={certificateCategories.map((c) => ({ value: c, label: c }))}
          />
          <Input
            label="Issuer"
            value={form.issuer}
            onChange={(e) => updateField('issuer', e.target.value)}
            placeholder="CodeWave"
            error={errors.issuer}
          />
          <Input
            label="Issued Date"
            type="date"
            value={form.issuedDate}
            onChange={(e) => updateField('issuedDate', e.target.value)}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) =>
              updateField('status', e.target.value as CertificateStatus)
            }
            options={certificateStatuses.map((s) => ({
              value: s.value,
              label: s.label,
            }))}
          />

          <CertificateImagePicker
            thumbnail={form.thumbnail}
            thumbnailType={form.thumbnailType ?? 'image'}
            onThumbnailChange={(url, type) => {
              updateField('thumbnail', url)
              if (type) updateField('thumbnailType', type)
            }}
            title={form.title}
            error={errors.thumbnail}
          />

          <div>
            <Input
              label="Credential URL (verify link)"
              value={form.credentialUrl}
              onChange={(e) => updateField('credentialUrl', e.target.value)}
              placeholder="https://hyperstack.id/credential/..."
            />
            <p className="mt-1.5 text-xs text-muted">
              Link to your online certificate page. Users open this via View Credential.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Certificate'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
