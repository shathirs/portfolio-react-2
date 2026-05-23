import type { ProjectMediaItem, ProjectMediaType } from '@/types'

export { resolveMediaUrl } from '@/lib/mediaUrl'

export const MEDIA_TYPE_LABELS: Record<ProjectMediaType, string> = {
  image: 'Image',
  video: 'Video',
  pdf: 'PDF',
  document: 'Word document',
}

export function sortMedia(items: ProjectMediaItem[]): ProjectMediaItem[] {
  return [...items].sort((a, b) => a.order - b.order)
}

export function newMediaItem(
  partial: Omit<ProjectMediaItem, 'order'> & { order?: number },
  order: number,
): ProjectMediaItem {
  return {
    id: partial.id ?? `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: partial.title ?? 'Untitled',
    type: partial.type,
    url: partial.url,
    mimeType: partial.mimeType ?? '',
    fileName: partial.fileName ?? '',
    order,
  }
}

export const PROJECT_MEDIA_ACCEPT =
  'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
