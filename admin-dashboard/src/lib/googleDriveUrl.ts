import type { ProjectMediaType } from '@/types'

/** Extract file ID from common Google Drive / Docs share URLs */
export function extractGoogleDriveFileId(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    const host = parsed.hostname.replace(/^www\./, '')
    if (host !== 'drive.google.com' && host !== 'docs.google.com') return null

    const filePath = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (filePath?.[1]) return filePath[1]

    const id = parsed.searchParams.get('id')
    if (id) return id

    return null
  } catch {
    return null
  }
}

export function isGoogleDriveFolderUrl(url?: string): boolean {
  if (!url?.trim()) return false
  return /drive\.google\.com\/(?:drive\/)?folders\//i.test(url.trim())
}

export function isGoogleDriveUrl(url?: string): boolean {
  return extractGoogleDriveFileId(url ?? '') !== null
}

/**
 * Turn a Google Drive share link into a URL the portfolio can load.
 * Files must be shared as “Anyone with the link”.
 */
export function normalizeGoogleDriveUrl(
  url: string,
  mediaType: ProjectMediaType | 'image' = 'image',
): string {
  const trimmed = url.trim()
  if (!trimmed) return ''

  if (isGoogleDriveFolderUrl(trimmed)) {
    return trimmed
  }

  const fileId = extractGoogleDriveFileId(trimmed)
  if (!fileId) return trimmed

  if (mediaType === 'video' || mediaType === 'pdf' || mediaType === 'document') {
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

/** Normalize any pasted URL (Drive share links → direct / preview URLs) */
export function normalizeExternalMediaUrl(
  url: string,
  mediaType: ProjectMediaType | 'image' = 'image',
): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (isGoogleDriveUrl(trimmed)) {
    return normalizeGoogleDriveUrl(trimmed, mediaType)
  }
  return trimmed
}

export const GOOGLE_DRIVE_FILE_HINT =
  'Paste a Google Drive file link (right-click file → Share → Anyone with the link). Folder links are not supported.'
