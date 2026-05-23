import { normalizeExternalMediaUrl } from '@/lib/googleDriveUrl'
import type { ProjectMediaType } from '@/types'

/** Resolve image URLs for admin previews — uploads, Drive links, external URLs */
export function resolveMediaUrl(
  url?: string,
  mediaType: ProjectMediaType | 'image' = 'image',
): string {
  if (!url?.trim()) return ''
  const value = url.trim()
  if (value.startsWith('blob:')) return ''
  if (value.startsWith('/uploads/')) return value
  if (value.startsWith('uploads/')) return `/${value}`
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return normalizeExternalMediaUrl(value, mediaType)
  }
  return value
}
