import { Router } from 'express'
import { Certificate } from '../models/Certificate.js'
import { protect } from '../middleware/auth.js'
import { uploadCertificateImage } from '../middleware/uploadCertificate.js'
import { mapDoc, mapDocs } from '../utils/mapDoc.js'
import { normalizeCertificateThumbnail } from '../utils/certificateMedia.js'

const router = Router()

function parseCertificateBody(body) {
  const data = {
    title: body.title?.trim(),
    subtitle: body.subtitle?.trim() ?? '',
    category: body.category,
    issuer: body.issuer?.trim(),
    status: body.status,
    ...normalizeCertificateThumbnail(
      body.thumbnail?.trim() ?? '',
      body.thumbnailType,
    ),
    credentialUrl: body.credentialUrl?.trim() ?? '',
    order: body.order ?? 0,
  }

  if (body.issuedDate === null || body.issuedDate === '') {
    data.issuedDate = null
  } else if (body.issuedDate) {
    const date = new Date(body.issuedDate)
    if (!Number.isNaN(date.getTime())) {
      data.issuedDate = date
    }
  }

  return data
}

function respondCertificateUpload(req, res, err) {
  if (err) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File must be smaller than 15MB'
        : err.message || 'Upload failed'
    return res.status(400).json({ message })
  }
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' })
  }
  const isPdf =
    req.file.mimetype === 'application/pdf' ||
    req.file.filename.toLowerCase().endsWith('.pdf')
  res.status(201).json({
    url: `/uploads/certificates/${req.file.filename}`,
    thumbnailType: isPdf ? 'pdf' : 'image',
  })
}

router.post('/upload', protect, (req, res) => {
  uploadCertificateImage.single('file')(req, res, (err) => {
    if (req.file || err) {
      return respondCertificateUpload(req, res, err)
    }
    uploadCertificateImage.single('image')(req, res, (err2) => {
      respondCertificateUpload(req, res, err2)
    })
  })
})

router.get('/stats', protect, async (_req, res) => {
  try {
    const [total, published, draft, deleted] = await Promise.all([
      Certificate.countDocuments({ status: { $ne: 'deleted' } }),
      Certificate.countDocuments({ status: 'published' }),
      Certificate.countDocuments({ status: 'draft' }),
      Certificate.countDocuments({ status: 'deleted' }),
    ])
    res.json({ total, published, draft, deleted })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/', protect, async (req, res) => {
  try {
    const filter = {}
    if (req.query.status) {
      filter.status = req.query.status
    } else if (req.query.includeDeleted !== 'true') {
      filter.status = { $ne: 'deleted' }
    }

    const certificates = await Certificate.find(filter).sort({ order: 1, issuedDate: -1 })
    res.json(mapDocs(certificates))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' })
    res.json(mapDoc(certificate))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const certificate = await Certificate.create(parseCertificateBody(req.body))
    res.status(201).json(mapDoc(certificate))
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message || 'Invalid data' })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      parseCertificateBody(req.body),
      {
        new: true,
        runValidators: true,
      },
    )
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' })
    res.json(mapDoc(certificate))
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message || 'Invalid data' })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const permanent = req.query.permanent === 'true'
    if (permanent) {
      const certificate = await Certificate.findByIdAndDelete(req.params.id)
      if (!certificate) return res.status(404).json({ message: 'Certificate not found' })
      return res.json({ message: 'Certificate permanently deleted' })
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { status: 'deleted' },
      { new: true },
    )
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' })
    res.json(mapDoc(certificate))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
