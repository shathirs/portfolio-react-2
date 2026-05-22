import type { ProjectMediaItem, ProjectMediaType } from '@/types'

export function resolveMediaUrl(url?: string): string {
  if (!url?.trim()) return ''
  const value = url.trim()
  if (value.startsWith('blob:')) return ''
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value.startsWith('/uploads/')) return value
  if (value.startsWith('uploads/')) return `/${value}`
  return value
}

export function sortMedia(items: ProjectMediaItem[] = []): ProjectMediaItem[] {
  return [...items].sort((a, b) => a.order - b.order)
}

export const MEDIA_LABELS: Record<ProjectMediaType, string> = {
  image: 'Image',
  video: 'Video',
  pdf: 'PDF',
  document: 'Document',
}
