import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { mediaTypeFromFile, safeExtension } from '../utils/projectMedia.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const projectUploadsDir = path.join(__dirname, '../../uploads/projects')

if (!fs.existsSync(projectUploadsDir)) {
  fs.mkdirSync(projectUploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, projectUploadsDir),
  filename: (req, file, cb) => {
    const type = mediaTypeFromFile(file)
    const ext = type ? safeExtension(type, file.originalname) : '.bin'
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})

function fileFilter(_req, file, cb) {
  if (mediaTypeFromFile(file)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        'Allowed: images (JPG, PNG, WebP), videos (MP4, WebM), PDF, Word (DOC, DOCX)',
      ),
      false,
    )
  }
}

function limitsForType(type) {
  if (type === 'video') return 50 * 1024 * 1024
  if (type === 'pdf' || type === 'document') return 15 * 1024 * 1024
  return 5 * 1024 * 1024
}

export const uploadProjectImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'), false)
  },
  limits: { fileSize: 5 * 1024 * 1024 },
})

export const uploadProjectMedia = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
})

export function assertMediaSize(file) {
  const type = mediaTypeFromFile(file)
  if (!type) return 'Unsupported file type'
  const max = limitsForType(type)
  if (file.size > max) {
    const mb = Math.round(max / (1024 * 1024))
    return `File too large. Max ${mb}MB for ${type} files.`
  }
  return null
}
