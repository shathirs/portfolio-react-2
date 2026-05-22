import { skillCategories, type SkillCategory } from '@/config/skillCategories'
import type { Skill } from '@/types'

export function groupSkillsByCategory(skills: Skill[]): { category: SkillCategory; skills: Skill[] }[] {
  const buckets = new Map<SkillCategory, Skill[]>()

  for (const cat of skillCategories) {
    buckets.set(cat, [])
  }

  for (const skill of skills) {
    const cat =
      skill.category && skillCategories.includes(skill.category as SkillCategory)
        ? (skill.category as SkillCategory)
        : 'Other'
    buckets.get(cat)!.push(skill)
  }

  return skillCategories
    .map((category) => ({
      category,
      skills: (buckets.get(category) ?? []).sort((a, b) => b.percentage - a.percentage),
    }))
    .filter((group) => group.skills.length > 0)
}
