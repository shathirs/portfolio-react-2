import { normalizeProjectCategory } from '../config/projectCategories.js'
import { mapDoc, mapDocs } from './mapDoc.js'

export function mapProject(doc) {
  const mapped = mapDoc(doc)
  if (!mapped) return mapped
  const media = Array.isArray(mapped.media)
    ? mapped.media.map((m) => ({
        title: m.title ?? '',
        type: m.type,
        url: m.url,
        mimeType: m.mimeType ?? '',
        fileName: m.fileName ?? '',
        order: m.order ?? 0,
        id: m.id ?? (m._id != null ? String(m._id) : undefined),
      }))
    : []
  const keyFeatures = Array.isArray(mapped.keyFeatures)
    ? mapped.keyFeatures
        .map((f) => String(f ?? '').trim())
        .filter(Boolean)
    : []

  return {
    ...mapped,
    category: normalizeProjectCategory(mapped.category),
    keyFeatures,
    media,
  }
}

export function mapProjects(docs) {
  return docs.map((d) => mapProject(d))
}
