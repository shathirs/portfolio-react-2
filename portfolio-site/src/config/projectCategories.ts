export const projectCategories = ['Academic', 'Hobby', 'Industry'] as const

export type ProjectCategory = (typeof projectCategories)[number]

export type ProjectFilter = 'All' | ProjectCategory

export const projectFilters: ProjectFilter[] = ['All', ...projectCategories]

const legacyCategoryMap: Record<string, ProjectCategory> = {
  'MERN Stack': 'Industry',
  'Full Stack': 'Industry',
  Frontend: 'Hobby',
  Backend: 'Industry',
  Mobile: 'Hobby',
  'AI / ML': 'Industry',
}

export function coerceProjectCategory(value: string | undefined): ProjectCategory {
  const cat = String(value ?? '').trim()
  if (projectCategories.includes(cat as ProjectCategory)) {
    return cat as ProjectCategory
  }
  return legacyCategoryMap[cat] ?? 'Academic'
}
