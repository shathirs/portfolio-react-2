import multer from 'multer'
import { mediaTypeFromFile } from '../utils/projectMedia.js'

const memory = multer.memoryStorage()

function imageFilter(_req, file, cb) {
  if (file.mimetype.startsWith('image/')) cb(null, true)
  else cb(new Error('Only image files are allowed'), false)
}

function certificateFilter(_req, file, cb) {
  const ext = (file.originalname || '').toLowerCase()
  const isImage = file.mimetype.startsWith('image/')
  const isPdf = file.mimetype === 'application/pdf' || ext.endsWith('.pdf')
  if (isImage || isPdf) cb(null, true)
  else cb(new Error('Only JPG, PNG, WebP, GIF, or PDF files are allowed'), false)
}

function projectMediaFilter(_req, file, cb) {
  if (mediaTypeFromFile(file)) cb(null, true)
  else {
    cb(
      new Error(
        'Allowed: images (JPG, PNG, WebP), videos (MP4, WebM), PDF, Word (DOC, DOCX)',
      ),
      false,
    )
  }
}

export const uploadCertificateImage = multer({
  storage: memory,
  fileFilter: certificateFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
})

export const uploadProjectImage = multer({
  storage: memory,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

export const uploadProjectMedia = multer({
  storage: memory,
  fileFilter: projectMediaFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
})

export const uploadProfileImage = multer({
  storage: memory,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})
