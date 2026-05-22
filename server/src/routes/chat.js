import { Router } from 'express'
import { isAiConfigured, replyToPortfolioChat } from '../services/portfolioChat.js'
import { SiteProfile } from '../models/SiteProfile.js'
import { defaultProfile } from '../config/defaultProfile.js'
import { mapDoc } from '../utils/mapDoc.js'

const router = Router()

const rateMap = new Map()
const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60_000

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = rateMap.get(ip) ?? { count: 0, resetAt: now + RATE_WINDOW_MS }
  if (now > entry.resetAt) {
    entry.count = 0
    entry.resetAt = now + RATE_WINDOW_MS
  }
  entry.count += 1
  rateMap.set(ip, entry)
  return entry.count <= RATE_LIMIT
}

router.get('/status', (_req, res) => {
  res.json({ configured: isAiConfigured() })
})

router.post('/', async (req, res) => {
  try {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown'
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        message: 'Too many messages. Please wait a minute and try again.',
      })
    }

    const profileDoc = await SiteProfile.findOne().sort({ createdAt: 1 })
    const profile = mapDoc(profileDoc) ?? defaultProfile
    const { messages } = req.body ?? {}

    const result = await replyToPortfolioChat(messages, profile.name)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      configured: isAiConfigured(),
      reply: 'The assistant is temporarily unavailable. Please try again or use the contact form.',
      message: err.message,
    })
  }
})

export default router
