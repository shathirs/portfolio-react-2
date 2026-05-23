import { normalizeExternalMediaUrl } from '@/lib/googleDriveUrl'
import type { Certificate } from '@/types'

export type CertificateInput = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>

/** Form state uses YYYY-MM-DD for date inputs */
export type CertificateFormState = Omit<CertificateInput, 'issuedDate'> & {
  issuedDate: string
}

export function certificateToFormState(cert: Certificate): CertificateFormState {
  let issuedDate = ''
  if (cert.issuedDate) {
    const raw = cert.issuedDate
    issuedDate =
      typeof raw === 'string'
        ? raw.slice(0, 10)
        : new Date(raw).toISOString().slice(0, 10)
  }

  return {
    title: cert.title ?? '',
    subtitle: cert.subtitle ?? '',
    category: cert.category ?? 'Professional',
    issuer: cert.issuer ?? '',
    issuedDate,
    status: cert.status ?? 'draft',
    thumbnail: cert.thumbnail ?? '',
    credentialUrl: cert.credentialUrl ?? '',
    order: cert.order ?? 0,
  }
}

export function emptyCertificateFormState(): CertificateFormState {
  return {
    title: '',
    subtitle: '',
    category: 'Professional',
    issuer: '',
    issuedDate: '',
    status: 'draft',
    thumbnail: '',
    credentialUrl: '',
    order: 0,
  }
}

export function formStateToPayload(form: CertificateFormState): CertificateInput {
  let issuedDate: string | null = null
  if (form.issuedDate) {
    const parsed = new Date(`${form.issuedDate}T00:00:00.000Z`)
    if (!Number.isNaN(parsed.getTime())) {
      issuedDate = parsed.toISOString()
    }
  }

  return {
    title: form.title.trim(),
    subtitle: (form.subtitle ?? '').trim(),
    category: form.category,
    issuer: form.issuer.trim(),
    issuedDate,
    status: form.status,
    thumbnail: normalizeExternalMediaUrl((form.thumbnail ?? '').trim(), 'image'),
    credentialUrl: (form.credentialUrl ?? '').trim(),
    order: form.order,
  }
}
