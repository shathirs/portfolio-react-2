import { SKILL_CATEGORIES } from '../config/skillCategories.js'
import { enrichSkillIcon } from '../utils/skillIconEnrich.js'
import { completeChat, isAiConfigured } from './aiProvider.js'

const VALID_CATEGORIES = new Set(SKILL_CATEGORIES)

function parseJsonArray(text) {
  const trimmed = text.trim()
  const match = trimmed.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('AI response did not contain JSON array')
  return JSON.parse(match[0])
}

function normalizeCategory(value) {
  const cat = String(value ?? '').trim()
  if (VALID_CATEGORIES.has(cat)) return cat
  const lower = cat.toLowerCase()
  const found = SKILL_CATEGORIES.find((c) => c.toLowerCase() === lower)
  return found ?? 'Other'
}

function normalizeSuggestion(raw) {
  const name = String(raw?.name ?? '').trim()
  if (!name) return null

  const percentage = Number(raw?.defaultPercentage ?? raw?.percentage ?? 75)
  const pct = Number.isFinite(percentage)
    ? Math.min(100, Math.max(0, Math.round(percentage)))
    : 75

  return {
    name,
    category: normalizeCategory(raw?.category),
    defaultPercentage: pct,
    icon: enrichSkillIcon(name, raw?.icon),
    reason: String(raw?.reason ?? '').trim(),
  }
}

async function callAi(prompt) {
  return completeChat(
    [
      {
        role: 'system',
        content:
          'You are a technical portfolio advisor. Respond with ONLY a JSON array, no markdown.',
      },
      { role: 'user', content: prompt },
    ],
    0.2,
  )
}

function buildPrompt({ query, excludeNames, profileHint }) {
  const exclude =
    excludeNames.length > 0
      ? excludeNames.join(', ')
      : 'none'

  const categories = SKILL_CATEGORIES.join(', ')

  const task = query.trim()
    ? `The admin is searching for: "${query.trim()}". Suggest up to 6 matching technical skills.`
    : `Suggest up to 8 technical skills to add to a developer portfolio. Focus on skills they are likely missing.`

  return `${task}

Profile: ${profileHint || 'MERN stack developer (MongoDB, Express, React, Node.js), full-stack web developer.'}

Already on portfolio (do NOT suggest these): ${exclude}

Valid categories (use exactly one per skill): ${categories}

Return ONLY a JSON array of objects with this shape:
[{"name":"React.js","category":"Frontend","defaultPercentage":90,"reason":"short reason"}]

Rules:
- Use real technology names (e.g. "React.js", "Node.js", "AWS", "Docker")
- defaultPercentage: integer 0-100
- category must be one of the valid categories listed above
- Prefer popular industry-standard tools`
}

export function isSkillAiConfigured() {
  return isAiConfigured()
}

export async function suggestSkillsWithAi({
  query = '',
  excludeNames = [],
  profileHint = '',
}) {
  const prompt = buildPrompt({ query, excludeNames, profileHint })
  const raw = await callAi(prompt)

  if (raw === null) {
    return {
      configured: false,
      suggestions: [],
    }
  }

  const parsed = parseJsonArray(raw)
  if (!Array.isArray(parsed)) {
    throw new Error('AI returned invalid format')
  }

  const exclude = new Set(excludeNames.map((n) => n.toLowerCase().trim()))
  const suggestions = parsed
    .map(normalizeSuggestion)
    .filter(Boolean)
    .filter((s) => !exclude.has(s.name.toLowerCase()))
    .slice(0, 8)

  return {
    configured: true,
    suggestions,
  }
}
