import {
  isCertificatePdf,
  resolveCertificateMediaUrl,
  type CertificateMediaType,
} from '@/lib/certificateMedia'

/** Resolve certificate media URL for preview (image or PDF) */
export function resolveThumbnailUrl(
  thumbnail?: string,
  mediaType?: CertificateMediaType,
): string {
  return resolveCertificateMediaUrl(thumbnail, mediaType)
}

export function canPreviewThumbnail(
  thumbnail?: string,
  mediaType?: CertificateMediaType,
): boolean {
  if (!thumbnail?.trim()) return false
  if (isCertificatePdf(thumbnail, mediaType)) return true
  const url = thumbnail.trim()
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) return true
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) return true
    if (url.includes('hyperstack.id/credential')) return false
    if (url.includes('/credential/') && !/\.(jpg|jpeg|png|gif|webp|svg)/i.test(url)) {
      return false
    }
    return true
  }
  return false
}
