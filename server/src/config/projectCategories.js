export const PROJECT_CATEGORIES = ['Academic', 'Hobby', 'Industry']

/** Maps old tech-stack labels to the new project categories */
const LEGACY_CATEGORY_MAP = {
  'MERN Stack': 'Industry',
  'Full Stack': 'Industry',
  Frontend: 'Hobby',
  Backend: 'Industry',
  Mobile: 'Hobby',
  'AI / ML': 'Industry',
}

export function normalizeProjectCategory(value) {
  const cat = String(value ?? '').trim()
  if (PROJECT_CATEGORIES.includes(cat)) return cat
  if (LEGACY_CATEGORY_MAP[cat]) return LEGACY_CATEGORY_MAP[cat]
  return 'Academic'
}
