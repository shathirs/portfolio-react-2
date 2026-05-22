import { Router } from 'express'
import { Message } from '../models/Message.js'
import { protect } from '../middleware/auth.js'
import {
  emitMessageCreated,
  emitMessageDeleted,
  emitMessageUpdated,
  onMessageCreated,
  onMessageDeleted,
  onMessageUpdated,
} from '../services/messageEvents.js'
import { resolveAuthUser } from '../utils/resolveAuthUser.js'
import { mapDoc, mapDocs } from '../utils/mapDoc.js'

const router = Router()

function mapMessage(doc) {
  const mapped = mapDoc(doc)
  if (!mapped) return null
  return {
    ...mapped,
    receivedAt: mapped.createdAt ?? mapped.receivedAt,
  }
}

function mapMessages(docs) {
  return docs.map((d) => mapMessage(d))
}

/** Public — portfolio contact form (must be before /:id routes) */
router.post('/contact', async (req, res) => {
  try {
    const senderName = String(req.body.senderName ?? '').trim()
    const senderEmail = String(req.body.senderEmail ?? '').trim().toLowerCase()
    const subject = String(req.body.subject ?? '').trim()
    const body = String(req.body.body ?? '').trim()

    if (!senderName || !senderEmail || !body) {
      return res.status(400).json({
        message: 'Name, email, and message are required',
      })
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)
    if (!emailOk) {
      return res.status(400).json({ message: 'Please enter a valid email address' })
    }

    const message = await Message.create({
      senderName,
      senderEmail,
      subject: subject || `Portfolio message from ${senderName}`,
      body,
      read: false,
    })

    const mapped = mapMessage(message)
    emitMessageCreated(mapped)
    res.status(201).json(mapped)
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message || 'Invalid data' })
  }
})

/** Admin SSE — live inbox updates (token via ?token= or Authorization header) */
router.get('/stream', async (req, res) => {
  const user = await resolveAuthUser(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders?.()

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  }

  const onCreated = (message) => send('message:created', message)
  const onUpdated = (message) => send('message:updated', message)
  const onDeleted = (id) => send('message:deleted', { id })

  const offCreated = onMessageCreated(onCreated)
  const offUpdated = onMessageUpdated(onUpdated)
  const offDeleted = onMessageDeleted(onDeleted)

  send('connected', { ok: true })

  const heartbeat = setInterval(() => {
    res.write(': ping\n\n')
  }, 25000)

  req.on('close', () => {
    clearInterval(heartbeat)
    offCreated()
    offUpdated()
    offDeleted()
  })
})

router.get('/', protect, async (_req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json(mapMessages(messages))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.patch('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: req.body.read ?? true },
      { new: true },
    )
    if (!message) return res.status(404).json({ message: 'Message not found' })
    const mapped = mapMessage(message)
    emitMessageUpdated(mapped)
    res.json(mapped)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id)
    if (!message) return res.status(404).json({ message: 'Message not found' })
    emitMessageDeleted(req.params.id)
    res.json({ message: 'Message deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
