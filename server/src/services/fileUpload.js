import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Readable } from 'stream'
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOAD_ROOT = path.join(__dirname, '../../uploads')

function baseCloudFolder() {
  return (process.env.CLOUDINARY_FOLDER || 'portfolio').replace(/\/$/, '')
}

export function getStorageMode() {
  return isCloudinaryConfigured() ? 'cloudinary' : 'local'
}

function inferResourceType(file) {
  const mime = String(file.mimetype || '').toLowerCase()
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('image/')) return 'image'
  if (mime === 'application/pdf') return 'image'
  return 'raw'
}

function safeFilename(file) {
  const ext = path.extname(file.originalname || '').toLowerCase()
  const base = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  return ext ? `${base}${ext}` : base
}

function uploadBufferToCloudinary(buffer, { folder, resourceType }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: false,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      },
    )
    Readable.from(buffer).pipe(stream)
  })
}

async function saveToLocalDisk(file, subfolder) {
  const dir = path.join(UPLOAD_ROOT, subfolder)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const filename = safeFilename(file)
  await fs.promises.writeFile(path.join(dir, filename), file.buffer)
  return `/uploads/${subfolder}/${filename}`
}

/**
 * Store an uploaded multer file (memory storage). Returns a public URL.
 * @param {import('multer').File} file
 * @param {'certificates'|'projects'|'profile'} subfolder
 * @param {{ resourceType?: 'image'|'video'|'raw'|'auto' }} [options]
 */
export async function persistUpload(file, subfolder, options = {}) {
  if (!file?.buffer?.length) {
    throw new Error('No file provided')
  }

  if (isCloudinaryConfigured()) {
    const folder = `${baseCloudFolder()}/${subfolder}`
    const resourceType = options.resourceType || inferResourceType(file)
    const result = await uploadBufferToCloudinary(file.buffer, {
      folder,
      resourceType,
    })
    return {
      url: result.secure_url,
      publicId: result.public_id,
      storage: 'cloudinary',
    }
  }

  const url = await saveToLocalDisk(file, subfolder)
  return { url, storage: 'local' }
}
