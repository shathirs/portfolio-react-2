export const skillCategories = [
  'Frontend',
  'Backend',
  'Database',
  'Cloud & DevOps',
  'Tools & Practices',
  'Other',
] as const

export type SkillCategory = (typeof skillCategories)[number]

export const categoryCardStyles: Record<SkillCategory, string> = {
  Frontend: 'border-violet-200/80 bg-gradient-to-br from-violet-50/90 to-white',
  Backend: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white',
  Database: 'border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white',
  'Cloud & DevOps': 'border-sky-200/80 bg-gradient-to-br from-sky-50/90 to-white',
  'Tools & Practices': 'border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 to-white',
  Other: 'border-slate-200 bg-gradient-to-br from-slate-50 to-white',
}

export const categoryHeaderAccent: Record<SkillCategory, string> = {
  Frontend: 'text-violet-600',
  Backend: 'text-emerald-600',
  Database: 'text-amber-600',
  'Cloud & DevOps': 'text-sky-600',
  'Tools & Practices': 'text-indigo-600',
  Other: 'text-slate-600',
}
