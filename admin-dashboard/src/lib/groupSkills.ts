import { skillCategories } from '@/config/skillCategories'
import type { Skill, SkillCategory } from '@/types'

export function groupSkillsByCategory(skills: Skill[]): { category: SkillCategory; skills: Skill[] }[] {
  const buckets = new Map<SkillCategory, Skill[]>()
  for (const cat of skillCategories) buckets.set(cat, [])

  for (const skill of skills) {
    const cat =
      skill.category && skillCategories.includes(skill.category)
        ? skill.category
        : 'Other'
    buckets.get(cat)!.push(skill)
  }

  return skillCategories
    .map((category) => ({
      category,
      skills: (buckets.get(category) ?? []).sort((a, b) => b.percentage - a.percentage),
    }))
    .filter((g) => g.skills.length > 0)
}
