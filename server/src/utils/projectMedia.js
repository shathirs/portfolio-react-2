const ALLOWED_TYPES = new Set(['image', 'video', 'pdf', 'document'])

const EXT_BY_TYPE = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  video: ['.mp4', '.webm'],
  pdf: ['.pdf'],
  document: ['.doc', '.docx'],
}

export function mediaTypeFromFile(file) {
  const mime = String(file.mimetype ?? '').toLowerCase()
  const ext = (file.originalname || '').toLowerCase()

  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime === 'application/pdf' || ext.endsWith('.pdf')) return 'pdf'
  if (
    mime === 'application/msword' ||
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext.endsWith('.doc') ||
    ext.endsWith('.docx')
  ) {
    return 'document'
  }
  return null
}

export function safeExtension(type, originalName) {
  const ext = (originalName || '').toLowerCase().match(/\.[a-z0-9]+$/)?.[0]
  if (ext && EXT_BY_TYPE[type]?.includes(ext)) return ext
  const defaults = { image: '.jpg', video: '.mp4', pdf: '.pdf', document: '.docx' }
  return defaults[type] || '.bin'
}

export function sanitizeMediaItem(raw, index = 0) {
  if (!raw || typeof raw !== 'object') return null
  const url = String(raw.url ?? '').trim()
  if (!url || url.startsWith('blob:')) return null

  let type = String(raw.type ?? '').toLowerCase()
  if (!ALLOWED_TYPES.has(type)) {
    if (/\.(jpe?g|png|gif|webp)$/i.test(url)) type = 'image'
    else if (/\.(mp4|webm)$/i.test(url)) type = 'video'
    else if (/\.pdf$/i.test(url)) type = 'pdf'
    else if (/\.(docx?)$/i.test(url)) type = 'document'
    else return null
  }

  return {
    title: String(raw.title ?? raw.fileName ?? '').trim() || 'Untitled',
    type,
    url,
    mimeType: String(raw.mimeType ?? '').trim(),
    fileName: String(raw.fileName ?? '').trim(),
    order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : index,
  }
}

export function sanitizeMediaList(list) {
  if (!Array.isArray(list)) return []
  return list
    .map((item, i) => sanitizeMediaItem(item, i))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order)
}
