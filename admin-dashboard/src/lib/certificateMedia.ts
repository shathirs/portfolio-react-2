import { normalizeExternalMediaUrl } from '@/lib/googleDriveUrl'

export type CertificateMediaType = 'image' | 'pdf'

export function inferCertificateMediaType(
  url?: string,
  explicitType?: CertificateMediaType,
): CertificateMediaType {
  if (explicitType === 'pdf' || explicitType === 'image') return explicitType
  const value = (url ?? '').toLowerCase()
  if (!value) return 'image'
  if (value.endsWith('.pdf') || value.includes('.pdf?')) return 'pdf'
  if (value.includes('/uploads/certificates/') && value.includes('.pdf')) return 'pdf'
  return 'image'
}

export function isCertificatePdf(
  url?: string,
  mediaType?: CertificateMediaType,
): boolean {
  return inferCertificateMediaType(url, mediaType) === 'pdf'
}

export function normalizeCertificateThumbnail(
  url: string,
  mediaType: CertificateMediaType = 'image',
) {
  const thumbnailType = inferCertificateMediaType(url, mediaType)
  return {
    thumbnail: normalizeExternalMediaUrl(url.trim(), thumbnailType),
    thumbnailType,
  }
}

export function resolveCertificateMediaUrl(
  url?: string,
  mediaType?: CertificateMediaType,
): string {
  if (!url?.trim()) return ''
  const value = url.trim()
  if (value.startsWith('/uploads/')) return value
  if (value.startsWith('uploads/')) return `/${value}`
  if (value.startsWith('http://') || value.startsWith('https://')) {
    const type = inferCertificateMediaType(value, mediaType)
    return normalizeExternalMediaUrl(value, type)
  }
  return value
}

export const CERTIFICATE_FILE_ACCEPT =
  'image/jpeg,image/png,image/gif,image/webp,application/pdf,.pdf'
