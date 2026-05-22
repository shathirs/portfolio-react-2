export function resolveProfileImageUrl(profileImage?: string): string {
  if (!profileImage?.trim()) return ''
  const url = profileImage.trim()
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/uploads/')) return url
  if (url.startsWith('uploads/')) return `/${url}`
  return url
}
