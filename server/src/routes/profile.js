import { Router } from 'express'
import { SiteProfile } from '../models/SiteProfile.js'
import { defaultProfile } from '../config/defaultProfile.js'
import { protect } from '../middleware/auth.js'
import { mapDoc } from '../utils/mapDoc.js'
import {
  profileUploadsDir,
  uploadProfileImage,
} from '../middleware/uploadProfile.js'

const router = Router()

async function getProfileDoc() {
  let doc = await SiteProfile.findOne().sort({ createdAt: 1 })
  if (!doc) {
    doc = await SiteProfile.create(defaultProfile)
  }
  return doc
}

/** Public — portfolio site */
router.get('/public', async (_req, res) => {
  try {
    const doc = await getProfileDoc()
    res.json(mapDoc(doc))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

/** Admin — read profile */
router.get('/', protect, async (_req, res) => {
  try {
    const doc = await getProfileDoc()
    res.json(mapDoc(doc))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

/** Admin — update profile fields */
router.put('/', protect, async (req, res) => {
  try {
    const doc = await getProfileDoc()
    const fields = [
      'name',
      'title',
      'tagline',
      'bio',
      'email',
      'phone',
      'location',
      'degree',
      'status',
      'cvUrl',
      'profileImage',
      'github',
      'linkedin',
    ]
    for (const key of fields) {
      if (req.body[key] !== undefined) {
        doc[key] = String(req.body[key]).trim()
      }
    }
    await doc.save()
    res.json(mapDoc(doc))
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message || 'Invalid data' })
  }
})

/** Admin — upload profile photo (replaces file on disk) */
router.post('/upload-image', protect, (req, res) => {
  uploadProfileImage.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' })
    }
    try {
      const doc = await getProfileDoc()
      doc.profileImage = `/uploads/profile/${req.file.filename}`
      await doc.save()
      res.json(mapDoc(doc))
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Failed to save profile image' })
    }
  })
})

export { profileUploadsDir }

export default router
