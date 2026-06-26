/** Static fallback served from portfolio-site/public/profile.png */
export const DEFAULT_PROFILE_IMAGE = '/profile.png'

/** Hosts that block hotlinking — use the local asset instead. */
const BLOCKED_IMAGE_HOSTS = ['licdn.com', 'linkedin.com']

export function resolveProfileImageUrl(profileImage?: string): string {
  if (!profileImage?.trim()) return DEFAULT_PROFILE_IMAGE
  const url = profileImage.trim()
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const host = new URL(url).hostname
      if (BLOCKED_IMAGE_HOSTS.some((blocked) => host.includes(blocked))) {
        return DEFAULT_PROFILE_IMAGE
      }
    } catch {
      return DEFAULT_PROFILE_IMAGE
    }
    return url
  }
  if (url.startsWith('/uploads/')) return url
  if (url.startsWith('uploads/')) return `/${url}`
  return url
}
