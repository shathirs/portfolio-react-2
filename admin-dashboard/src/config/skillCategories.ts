import type { SkillCategory } from '@/types'

export const skillCategories: SkillCategory[] = [
  'Frontend',
  'Backend',
  'Database',
  'Cloud & DevOps',
  'Tools & Practices',
  'Other',
]

export const categoryCardStyles: Record<SkillCategory, string> = {
  Frontend: 'border-violet-200 bg-gradient-to-br from-violet-50/80 to-white',
  Backend: 'border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white',
  Database: 'border-amber-200 bg-gradient-to-br from-amber-50/80 to-white',
  'Cloud & DevOps': 'border-sky-200 bg-gradient-to-br from-sky-50/80 to-white',
  'Tools & Practices': 'border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white',
  Other: 'border-slate-200 bg-gradient-to-br from-slate-50/80 to-white',
}

export const categoryBadgeStyles: Record<SkillCategory, string> = {
  Frontend: 'bg-violet-100 text-violet-700',
  Backend: 'bg-emerald-100 text-emerald-700',
  Database: 'bg-amber-100 text-amber-800',
  'Cloud & DevOps': 'bg-sky-100 text-sky-700',
  'Tools & Practices': 'bg-indigo-100 text-indigo-700',
  Other: 'bg-slate-100 text-slate-700',
}

export const categoryHeaderAccent: Record<SkillCategory, string> = {
  Frontend: 'text-violet-600',
  Backend: 'text-emerald-600',
  Database: 'text-amber-600',
  'Cloud & DevOps': 'text-sky-600',
  'Tools & Practices': 'text-indigo-600',
  Other: 'text-slate-600',
}
