import { Router } from 'express'
import { Project } from '../models/Project.js'
import { Skill } from '../models/Skill.js'
import { Message } from '../models/Message.js'
import { Certificate } from '../models/Certificate.js'
import { protect } from '../middleware/auth.js'
import { mapDocs } from '../utils/mapDoc.js'

const router = Router()

router.get('/stats', protect, async (_req, res) => {
  try {
    const [totalProjects, totalSkills, totalCertificates, totalMessages, unreadMessages] =
      await Promise.all([
        Project.countDocuments(),
        Skill.countDocuments(),
        Certificate.countDocuments({ status: { $ne: 'deleted' } }),
        Message.countDocuments(),
        Message.countDocuments({ read: false }),
      ])

    res.json({
      totalProjects,
      totalSkills,
      totalCertificates,
      totalMessages,
      unreadMessages,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/recent', protect, async (_req, res) => {
  try {
    const [projects, messages] = await Promise.all([
      Project.find().sort({ createdAt: -1 }).limit(4),
      Message.find().sort({ createdAt: -1 }).limit(4),
    ])

    const mapMessage = (doc) => {
      const m = mapDocs([doc])[0]
      return { ...m, receivedAt: m.createdAt }
    }

    res.json({
      projects: mapDocs(projects),
      messages: messages.map(mapMessage),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
