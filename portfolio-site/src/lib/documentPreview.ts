import { normalizeExternalMediaUrl } from '@/lib/googleDriveUrl'
import type { ProjectMediaType } from '@/types'

export function isPdfMedia(url?: string, type?: ProjectMediaType): boolean {
  if (type === 'pdf') return true
  const u = (url ?? '').toLowerCase()
  return /\.pdf(\?|#|$)/i.test(u)
}

export function isWordDocument(url?: string, type?: ProjectMediaType): boolean {
  if (type === 'document') return true
  return /\.(docx?)(\?|#|$)/i.test(url ?? '')
}

export function isDriveEmbedUrl(url: string): boolean {
  return /drive\.google\.com\/file\/d\//i.test(url)
}

/** Absolute URL (needed for embed viewers and local /uploads paths) */
export function toAbsoluteUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (typeof window === 'undefined') return trimmed
  return `${window.location.origin}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`
}

function resolveStoredUrl(url: string, type: ProjectMediaType): string {
  const trimmed = url.trim()
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return normalizeExternalMediaUrl(trimmed, type)
  }
  return trimmed
}

/** Direct PDF file URL — opens in the browser tab (no broken raw→image swap) */
export function getPdfDirectUrl(url?: string, type: ProjectMediaType = 'pdf'): string {
  if (!url?.trim()) return ''
  const resolved = resolveStoredUrl(url, type)
  if (isDriveEmbedUrl(resolved)) return resolved

  if (resolved.includes('res.cloudinary.com')) {
    let next = resolved.replace(/\/fl_attachment[^/]*\//g, '/')
    if (next.includes('/image/upload/') && !next.includes('fl_inline')) {
      next = next.replace('/image/upload/', '/image/upload/fl_inline/')
    }
    return next
  }

  return resolved
}

/** Embedded preview (Google viewer for public PDFs; Drive uses native preview) */
export function getPdfEmbedUrl(url?: string, type: ProjectMediaType = 'pdf'): string {
  const direct = getPdfDirectUrl(url, type)
  if (!direct) return ''
  if (isDriveEmbedUrl(direct)) return direct

  const absolute = toAbsoluteUrl(direct)
  if (!absolute.startsWith('http')) return absolute

  return `https://docs.google.com/gview?url=${encodeURIComponent(absolute)}&embedded=true`
}

export function getDocumentPreviewUrl(
  url?: string,
  type: ProjectMediaType = 'pdf',
): string {
  if (!url?.trim()) return ''

  const resolved = resolveStoredUrl(url, type)

  if (isDriveEmbedUrl(resolved)) return resolved

  if (isWordDocument(resolved, type)) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      toAbsoluteUrl(resolved),
    )}`
  }

  if (isPdfMedia(resolved, type)) {
    return getPdfEmbedUrl(resolved, type)
  }

  return resolved
}

export function getDocumentDownloadUrl(url?: string): string {
  if (!url?.trim()) return ''
  const resolved = url.trim()
  if (!resolved.includes('res.cloudinary.com')) return toAbsoluteUrl(resolved)
  if (resolved.includes('/fl_attachment')) return resolved
  if (resolved.includes('/fl_inline/')) {
    return resolved.replace('/fl_inline/', '/fl_attachment/')
  }
  return resolved.replace('/upload/', '/upload/fl_attachment/')
}
