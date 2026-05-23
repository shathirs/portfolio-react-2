import { normalizeExternalMediaUrl } from './googleDriveUrl.js'

export function inferCertificateMediaType(url, explicitType) {
  if (explicitType === 'pdf' || explicitType === 'image') return explicitType
  const value = String(url ?? '').toLowerCase()
  if (!value) return 'image'
  if (value.endsWith('.pdf') || value.includes('.pdf?')) return 'pdf'
  if (value.includes('/uploads/certificates/') && value.includes('.pdf')) return 'pdf'
  return 'image'
}

export function normalizeCertificateThumbnail(url, mediaType = 'image') {
  const type = inferCertificateMediaType(url, mediaType)
  return {
    thumbnail: normalizeExternalMediaUrl(String(url ?? '').trim(), type),
    thumbnailType: type,
  }
}
