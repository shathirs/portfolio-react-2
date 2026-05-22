import { Router } from 'express'
import { Skill } from '../models/Skill.js'
import { protect } from '../middleware/auth.js'
import { mapDoc, mapDocs } from '../utils/mapDoc.js'
import {
  isSkillAiConfigured,
  suggestSkillsWithAi,
} from '../services/skillAiSuggest.js'

const router = Router()

/** AI skill recommendations (admin add-skill) */
router.post('/suggest', protect, async (req, res) => {
  try {
    if (!isSkillAiConfigured()) {
      return res.status(503).json({
        message:
          'AI not configured. Add GROQ_API_KEY, GEMINI_API_KEY, or OPENAI_API_KEY to server/.env',
        configured: false,
        suggestions: [],
      })
    }

    const { query = '', excludeNames = [], profileHint = '' } = req.body
    const exclude = Array.isArray(excludeNames)
      ? excludeNames.map(String)
      : []

    const result = await suggestSkillsWithAi({
      query: String(query),
      excludeNames: exclude,
      profileHint: String(profileHint),
    })

    res.json({
      configured: true,
      source: 'ai',
      suggestions: result.suggestions,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: err.message || 'AI suggestion failed',
      configured: true,
      suggestions: [],
    })
  }
})

router.get('/', protect, async (_req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, percentage: -1 })
    res.json(mapDocs(skills))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const skill = await Skill.create(req.body)
    res.status(201).json(mapDoc(skill))
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message || 'Invalid data' })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!skill) return res.status(404).json({ message: 'Skill not found' })
    res.json(mapDoc(skill))
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message || 'Invalid data' })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id)
    if (!skill) return res.status(404).json({ message: 'Skill not found' })
    res.json({ message: 'Skill deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
