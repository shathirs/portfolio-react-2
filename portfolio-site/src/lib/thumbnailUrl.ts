import { normalizeExternalMediaUrl } from '@/lib/googleDriveUrl'

export function resolveThumbnailUrl(thumbnail?: string): string {
  if (!thumbnail?.trim()) return ''
  const url = thumbnail.trim()
  if (url.startsWith('/uploads/')) return url
  if (url.startsWith('uploads/')) return `/${url}`
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return normalizeExternalMediaUrl(url, 'image')
  }
  return url
}

export function canPreviewThumbnail(thumbnail?: string): boolean {
  if (!thumbnail?.trim()) return false
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
