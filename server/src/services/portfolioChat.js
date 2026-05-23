import { isAiConfigured, completeChat } from './aiProvider.js'
import { buildPortfolioContext } from './portfolioContext.js'

let cachedContext = null
let cacheExpiry = 0
const CACHE_MS = 5 * 60 * 1000

async function getContext() {
  const now = Date.now()
  if (cachedContext && now < cacheExpiry) return cachedContext
  cachedContext = await buildPortfolioContext()
  cacheExpiry = now + CACHE_MS
  return cachedContext
}

function buildSystemPrompt(portfolioContext, ownerName) {
  return [
    `You are ${ownerName}'s AI assistant on their portfolio website.`,
    'Answer questions using ONLY the portfolio context below.',
    'If something is not in the context, say so briefly and point to the contact form or profile links.',
    'Do not invent employers, grades, projects, or institutions.',
    '',
    '=== FORMATTING (required) ===',
    'Always present information in a clean, scannable structure — never long paragraphs when listing multiple items.',
    '',
    'When the answer includes 2 or more items (education, projects, skills, certificates, links, etc.):',
    '- Use a bullet list. Start each line with "• " (bullet + space).',
    '- Put ONE item per bullet (e.g. one school/degree per bullet, one project per bullet).',
    '- Under each bullet, use short indented lines with labels if helpful, e.g.:',
    '  Institution: ...',
    '  Period: ...',
    '  Details: ... (one short line max)',
    '',
    'Example — education question:',
    '• BSc (Hons) in Software Engineering',
    '  Institution: University of Bedfordshire',
    '  Period: 2025 – Present',
    '• Higher Diploma in Information Technology',
    '  Institution: SLIIT City Uni',
    '  Period: 2022 – 2025',
    '',
    'For a single fact (email, name, one project detail): use 1–2 short sentences only.',
    'For skills grouped by category: use bullets per category with sub-bullets for skill names.',
    'Include URLs on their own line under the relevant bullet when available.',
    'Do not use markdown headers (#). Plain text and • bullets only.',
    '',
    'Portfolio context:',
    portfolioContext,
  ].join('\n')
}

function normalizeMessages(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
    .map((m) => ({
      role: m.role,
      content: String(m.content ?? '').trim().slice(0, 2000),
    }))
    .filter((m) => m.content.length > 0)
    .slice(-12)
}

export { isAiConfigured }

export async function replyToPortfolioChat(rawMessages, ownerName = 'the portfolio owner') {
  if (!isAiConfigured()) {
    return {
      configured: false,
      reply:
        'The AI assistant is not configured yet. Please use the contact section to reach out directly.',
    }
  }

  const userMessages = normalizeMessages(rawMessages)
  const lastUser = [...userMessages].reverse().find((m) => m.role === 'user')
  if (!lastUser) {
    return { configured: true, reply: 'Please ask a question about the portfolio.' }
  }

  const portfolioContext = await getContext()
  const system = buildSystemPrompt(portfolioContext, ownerName)

  const apiMessages = [
    { role: 'system', content: system },
    ...userMessages,
  ]

  const reply = await completeChat(apiMessages, 0.25)
  if (reply === null) {
    return {
      configured: false,
      reply:
        'The AI assistant is not configured yet. Please use the contact section to reach out directly.',
    }
  }

  return {
    configured: true,
    reply: reply.trim() || "I couldn't generate a response. Please try again.",
  }
}
