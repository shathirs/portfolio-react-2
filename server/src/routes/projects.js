import { Router } from 'express'
import { normalizeProjectCategory } from '../config/projectCategories.js'
import { Project } from '../models/Project.js'
import { protect } from '../middleware/auth.js'
import {
  assertMediaSize,
  uploadProjectImage,
  uploadProjectMedia,
} from '../middleware/uploadProject.js'
import { mediaTypeFromFile } from '../utils/projectMedia.js'
import { mapProject, mapProjects } from '../utils/mapProject.js'
import { sanitizeMediaList } from '../utils/projectMedia.js'
import { normalizeExternalMediaUrl } from '../utils/googleDriveUrl.js'

const router = Router()

function sanitizeKeyFeatures(value) {
  if (!Array.isArray(value)) return []
  return value.map((f) => String(f ?? '').trim()).filter(Boolean)
}

function sanitizeImageUrl(url) {
  const value = String(url ?? '').trim()
  if (!value || value.startsWith('blob:')) return ''
  return normalizeExternalMediaUrl(value, 'image')
}

function sanitizeProjectBody(body) {
  if (!body || typeof body !== 'object') return body
  const media = sanitizeMediaList(body.media)
  let imageUrl = sanitizeImageUrl(body.imageUrl)
  if (!imageUrl) {
    const firstImage = media.find((m) => m.type === 'image')
    if (firstImage) imageUrl = firstImage.url
  }
  const out = {
    ...body,
    imageUrl,
    media,
  }
  if ('category' in body) {
    out.category = normalizeProjectCategory(body.category)
  }
  if ('keyFeatures' in body) {
    out.keyFeatures = sanitizeKeyFeatures(body.keyFeatures)
  }
  return out
}

router.get('/', protect, async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json(mapProjects(projects))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(mapProject(project))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/upload', protect, (req, res) => {
  uploadProjectImage.single('image')(req, res, (err) => {
    if (err) {
      console.error(err)
      return res.status(400).json({ message: err.message || 'Upload failed' })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' })
    }
    res.json({
      url: `/uploads/projects/${req.file.filename}`,
      type: 'image',
      mimeType: req.file.mimetype,
      fileName: req.file.originalname,
    })
  })
})

router.post('/upload-media', protect, (req, res) => {
  uploadProjectMedia.single('file')(req, res, (err) => {
    if (err) {
      console.error(err)
      return res.status(400).json({ message: err.message || 'Upload failed' })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' })
    }
    const sizeErr = assertMediaSize(req.file)
    if (sizeErr) return res.status(400).json({ message: sizeErr })

    const type = mediaTypeFromFile(req.file)
    res.json({
      url: `/uploads/projects/${req.file.filename}`,
      type,
      mimeType: req.file.mimetype,
      fileName: req.file.originalname,
      title: req.file.originalname.replace(/\.[^.]+$/, ''),
    })
  })
})

router.post('/', protect, async (req, res) => {
  try {
    const project = await Project.create(sanitizeProjectBody(req.body))
    res.status(201).json(mapProject(project))
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message || 'Invalid data' })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      sanitizeProjectBody(req.body),
      { new: true, runValidators: true },
    )
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(mapProject(project))
  } catch (err) {
    console.error(err)
    res
      .status(err.statusCode || 400)
      .json({ message: err.message || 'Invalid data' })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json({ message: 'Project deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
