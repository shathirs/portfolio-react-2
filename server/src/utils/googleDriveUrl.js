export function extractGoogleDriveFileId(url) {
  const trimmed = String(url || '').trim()
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

export function isGoogleDriveUrl(url) {
  return extractGoogleDriveFileId(url) !== null
}

export function normalizeGoogleDriveUrl(url, mediaType = 'image') {
  const trimmed = String(url || '').trim()
  if (!trimmed) return ''

  const fileId = extractGoogleDriveFileId(trimmed)
  if (!fileId) return trimmed

  if (mediaType === 'video' || mediaType === 'pdf' || mediaType === 'document') {
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

export function normalizeExternalMediaUrl(url, mediaType = 'image') {
  const trimmed = String(url || '').trim()
  if (!trimmed) return ''
  if (isGoogleDriveUrl(trimmed)) {
    return normalizeGoogleDriveUrl(trimmed, mediaType)
  }
  return trimmed
}
