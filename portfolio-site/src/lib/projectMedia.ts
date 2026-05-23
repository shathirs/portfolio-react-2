import type { ProjectMediaItem, ProjectMediaType } from '@/types'

export { resolveMediaUrl } from '@/lib/mediaUrl'

export function sortMedia(items: ProjectMediaItem[] = []): ProjectMediaItem[] {
  return [...items].sort((a, b) => a.order - b.order)
}

export const MEDIA_LABELS: Record<ProjectMediaType, string> = {
  image: 'Image',
  video: 'Video',
  pdf: 'PDF',
  document: 'Document',
}
