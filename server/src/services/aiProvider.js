export function isAiConfigured() {
  return Boolean(
    process.env.GROQ_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.OPENAI_API_KEY,
  )
}

async function callGroq(messages, temperature) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, temperature, messages }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Groq API request failed')
  }
  return data?.choices?.[0]?.message?.content ?? ''
}

async function callGemini(messages, temperature) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  const system = messages.find((m) => m.role === 'system')?.content ?? ''
  const conversation = messages
    .filter((m) => m.role !== 'system')
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n\n')

  const prompt = system
    ? `${system}\n\n---\n\n${conversation}\n\nAssistant:`
    : `${conversation}\n\nAssistant:`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Gemini API request failed')
  }
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function callOpenAI(messages, temperature) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, temperature, messages }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error?.message || 'OpenAI API request failed')
  }
  return data?.choices?.[0]?.message?.content ?? ''
}

/** @param {{ role: string, content: string }[]} messages */
export async function completeChat(messages, temperature = 0.3) {
  if (process.env.GROQ_API_KEY) return callGroq(messages, temperature)
  if (process.env.GEMINI_API_KEY) return callGemini(messages, temperature)
  if (process.env.OPENAI_API_KEY) return callOpenAI(messages, temperature)
  return null
}
