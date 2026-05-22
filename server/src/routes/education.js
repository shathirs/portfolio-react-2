import { Router } from 'express'
import { Education } from '../models/Education.js'
import { protect } from '../middleware/auth.js'
import { mapDoc, mapDocs } from '../utils/mapDoc.js'

const router = Router()

router.get('/', protect, async (_req, res) => {
  try {
    const entries = await Education.find().sort({ order: 1, createdAt: -1 })
    res.json(mapDocs(entries))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const entry = await Education.create(req.body)
    res.status(201).json(mapDoc(entry))
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message || 'Invalid data' })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const entry = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!entry) return res.status(404).json({ message: 'Education entry not found' })
    res.json(mapDoc(entry))
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message || 'Invalid data' })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const entry = await Education.findByIdAndDelete(req.params.id)
    if (!entry) return res.status(404).json({ message: 'Education entry not found' })
    res.json({ message: 'Education entry deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
