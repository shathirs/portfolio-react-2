export const projectCategories = ['Academic', 'Hobby', 'Industry'] as const

export type ProjectCategory = (typeof projectCategories)[number]

const legacyCategoryMap: Record<string, ProjectCategory> = {
  'MERN Stack': 'Industry',
  'Full Stack': 'Industry',
  Frontend: 'Hobby',
  Backend: 'Industry',
  Mobile: 'Hobby',
  'AI / ML': 'Industry',
}

/** Coerce API/DB values (including legacy labels) to a valid category */
export function coerceProjectCategory(value: string | undefined): ProjectCategory {
  const cat = String(value ?? '').trim()
  if (projectCategories.includes(cat as ProjectCategory)) {
    return cat as ProjectCategory
  }
  return legacyCategoryMap[cat] ?? 'Academic'
}

export const projectStatuses = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
] as const

export const commonTechnologies = [
  'MongoDB',
  'Express',
  'React',
  'Node.js',
  'TypeScript',
  'Tailwind CSS',
  'Python',
  'PostgreSQL',
  'Docker',
  'AWS',
  'OpenAI',
  'Vite',
]
