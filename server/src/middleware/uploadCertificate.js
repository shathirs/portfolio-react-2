import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const uploadsDir = path.join(__dirname, '../../uploads/certificates')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const isPdf =
      file.mimetype === 'application/pdf' || ext === '.pdf'
    if (isPdf) {
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`)
      return
    }
    const safeExt = IMAGE_EXT.includes(ext) ? ext : '.jpg'
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`)
  },
})

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase()
  const isImage = file.mimetype.startsWith('image/')
  const isPdf = file.mimetype === 'application/pdf' || ext === '.pdf'
  if (isImage || isPdf) {
    cb(null, true)
  } else {
    cb(new Error('Only JPG, PNG, WebP, GIF, or PDF files are allowed'), false)
  }
}

export const uploadCertificateImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
})

/** @deprecated alias */
export const uploadCertificateFile = uploadCertificateImage
