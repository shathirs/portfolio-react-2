/** Resolve image URLs for admin previews — uploads, external links */
export function resolveMediaUrl(url?: string): string {
  if (!url?.trim()) return ''
  const value = url.trim()
  if (value.startsWith('blob:')) return ''
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value.startsWith('/uploads/')) return value
  if (value.startsWith('uploads/')) return `/${value}`
  return value
}
