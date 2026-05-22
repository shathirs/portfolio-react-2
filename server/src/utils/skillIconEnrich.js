const DEVICON_BASE =
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

/** Direct logo URLs for skills where name-based lookup needs a stored icon */
const ICON_BY_NAME = {
  aws: `${DEVICON_BASE}/amazonwebservices/amazonwebservices-original.svg`,
  'amazon web services': `${DEVICON_BASE}/amazonwebservices/amazonwebservices-original.svg`,
  'c++': `${DEVICON_BASE}/cplusplus/cplusplus-original.svg`,
  cpp: `${DEVICON_BASE}/cplusplus/cplusplus-original.svg`,
  cplusplus: `${DEVICON_BASE}/cplusplus/cplusplus-original.svg`,
  'c plus plus': `${DEVICON_BASE}/cplusplus/cplusplus-original.svg`,
  'c#': `${DEVICON_BASE}/csharp/csharp-original.svg`,
  csharp: `${DEVICON_BASE}/csharp/csharp-original.svg`,
  'c-sharp': `${DEVICON_BASE}/csharp/csharp-original.svg`,
  cursor: 'https://cdn.simpleicons.org/cursor/000000',
  'cursor ide': 'https://cdn.simpleicons.org/cursor/000000',
  render: 'https://cdn.simpleicons.org/render/46E3B7',
  netlify: 'https://cdn.simpleicons.org/netlify/00C7B7',
  railway: 'https://cdn.simpleicons.org/railway/0B0D0E',
  vercel: 'https://cdn.simpleicons.org/vercel/000000',
  digitalocean: 'https://cdn.simpleicons.org/digitalocean/0080FF',
  'digital ocean': 'https://cdn.simpleicons.org/digitalocean/0080FF',
  fly: 'https://cdn.simpleicons.org/flydotio/24175B',
  'fly.io': 'https://cdn.simpleicons.org/flydotio/24175B',
}

function normalizeKey(name) {
  return String(name).toLowerCase().trim().replace(/\s+/g, ' ')
}

export function enrichSkillIcon(name, icon = '') {
  if (icon?.trim()) return icon.trim()
  const key = normalizeKey(name)
  return ICON_BY_NAME[key] ?? ''
}
