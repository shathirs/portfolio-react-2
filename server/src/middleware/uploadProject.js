import { mediaTypeFromFile } from '../utils/projectMedia.js'

export {
  uploadProjectImage,
  uploadProjectMedia,
} from './multerMemory.js'

export const projectUploadsDir = null

export function assertMediaSize(file) {
  const type = mediaTypeFromFile(file)
  if (!type) return 'Unsupported file type'
  const max =
    type === 'video'
      ? 50 * 1024 * 1024
      : type === 'pdf' || type === 'document'
        ? 15 * 1024 * 1024
        : 5 * 1024 * 1024
  if (file.size > max) {
    const mb = Math.round(max / (1024 * 1024))
    return `File too large. Max ${mb}MB for ${type} files.`
  }
  return null
}
