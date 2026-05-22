import type { CertificateCategory } from '@/types'

export const certificateCategories: CertificateCategory[] = [
  'Web Development',
  'Database',
  'Programming',
  'Tools & Platforms',
  'Academic',
  'Professional',
  'Other',
]

export const categoryBadgeStyles: Record<CertificateCategory, string> = {
  'Web Development': 'bg-violet-100 text-violet-700',
  Database: 'bg-emerald-100 text-emerald-700',
  Programming: 'bg-amber-100 text-amber-800',
  'Tools & Platforms': 'bg-blue-100 text-blue-700',
  Academic: 'bg-indigo-100 text-indigo-700',
  Professional: 'bg-slate-100 text-slate-700',
  Other: 'bg-gray-100 text-gray-700',
}

export const certificateStatuses = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
] as const
