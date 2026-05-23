import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { uploadsDir } from './middleware/uploadCertificate.js'
import { projectUploadsDir } from './middleware/uploadProject.js'
import { connectDB } from './config/db.js'
import { ensureAdmin } from './config/ensureAdmin.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import skillRoutes from './routes/skills.js'
import messageRoutes from './routes/messages.js'
import dashboardRoutes from './routes/dashboard.js'
import certificateRoutes from './routes/certificates.js'
import educationRoutes from './routes/education.js'
import publicRoutes from './routes/public.js'
import chatRoutes from './routes/chat.js'
import profileRoutes, { profileUploadsDir } from './routes/profile.js'
import { ensureProfile } from './config/ensureProfile.js'

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = (
  process.env.CLIENT_URL ||
  'http://localhost:5173,http://localhost:5174'
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

const isDev = process.env.NODE_ENV !== 'production'

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (allowedOrigins.includes(origin)) return true
  if (isDev && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true
  }
  // Vercel production + preview deployments (portfolio + admin)
  if (/^https:\/\/[\w.-]+\.vercel\.app$/.test(origin)) {
    return true
  }
  return false
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '10mb' }))
app.use('/uploads/certificates', express.static(uploadsDir))
app.use('/uploads/projects', express.static(projectUploadsDir))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/education', educationRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/public/chat', chatRoutes)
app.use('/api/profile', profileRoutes)

app.use((err, req, res, _next) => {
  console.error(err)
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      message:
        'Request blocked by CORS. Add your site URL to CLIENT_URL (Render env / server .env), e.g. https://your-site.vercel.app',
    })
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'File too large. Images ≤5MB, PDF/Word ≤15MB, video ≤50MB.',
    })
  }
  if (req.file || err.message?.includes('image')) {
    return res.status(400).json({ message: err.message || 'Upload failed' })
  }
  res.status(500).json({ message: 'Internal server error' })
})

async function start() {
  await connectDB()
  await ensureAdmin()
  await ensureProfile()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
