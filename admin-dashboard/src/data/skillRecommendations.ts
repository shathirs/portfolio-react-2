import type { SkillCategory } from '@/types'

export type SkillRecommendation = {
  name: string
  category: SkillCategory
  /** Stored in DB when logo cannot be resolved by name alone (e.g. AWS) */
  icon?: string
  defaultPercentage?: number
  /** Shown for AI-generated picks */
  reason?: string
}

/** Curated skills with category + logo — used in the add-skill picker */
export const skillRecommendations: SkillRecommendation[] = [
  // Frontend
  { name: 'React.js', category: 'Frontend', defaultPercentage: 90 },
  { name: 'Next.js', category: 'Frontend', defaultPercentage: 85 },
  { name: 'TypeScript', category: 'Frontend', defaultPercentage: 85 },
  { name: 'JavaScript', category: 'Frontend', defaultPercentage: 90 },
  { name: 'Tailwind CSS', category: 'Frontend', defaultPercentage: 90 },
  { name: 'HTML/CSS', category: 'Frontend', defaultPercentage: 88 },
  { name: 'Vue.js', category: 'Frontend', defaultPercentage: 75 },
  { name: 'Angular', category: 'Frontend', defaultPercentage: 70 },
  { name: 'Redux', category: 'Frontend', defaultPercentage: 80 },
  { name: 'Vite', category: 'Frontend', defaultPercentage: 85 },
  // Backend
  { name: 'Node.js', category: 'Backend', defaultPercentage: 88 },
  { name: 'Express.js', category: 'Backend', defaultPercentage: 85 },
  { name: 'PHP', category: 'Backend', defaultPercentage: 75 },
  { name: 'Python', category: 'Backend', defaultPercentage: 80 },
  { name: 'Java', category: 'Backend', defaultPercentage: 70 },
  { name: 'REST APIs', category: 'Backend', defaultPercentage: 86 },
  { name: 'GraphQL', category: 'Backend', defaultPercentage: 75 },
  { name: 'C#', category: 'Backend', defaultPercentage: 70 },
  {
    name: 'C++',
    category: 'Backend',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
    defaultPercentage: 70,
  },
  { name: 'Go', category: 'Backend', defaultPercentage: 72 },
  { name: 'Rust', category: 'Backend', defaultPercentage: 68 },
  { name: 'Kotlin', category: 'Backend', defaultPercentage: 70 },
  { name: 'Swift', category: 'Backend', defaultPercentage: 65 },
  // Database
  { name: 'MongoDB', category: 'Database', defaultPercentage: 85 },
  { name: 'PostgreSQL', category: 'Database', defaultPercentage: 78 },
  { name: 'MySQL', category: 'Database', defaultPercentage: 80 },
  { name: 'Redis', category: 'Database', defaultPercentage: 70 },
  { name: 'Firebase', category: 'Database', defaultPercentage: 72 },
  // Cloud & DevOps
  {
    name: 'AWS',
    category: 'Cloud & DevOps',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original.svg',
    defaultPercentage: 70,
  },
  { name: 'Docker', category: 'Cloud & DevOps', defaultPercentage: 75 },
  { name: 'Kubernetes', category: 'Cloud & DevOps', defaultPercentage: 65 },
  { name: 'Azure', category: 'Cloud & DevOps', defaultPercentage: 65 },
  { name: 'Google Cloud', category: 'Cloud & DevOps', defaultPercentage: 65 },
  { name: 'CI/CD', category: 'Cloud & DevOps', defaultPercentage: 70 },
  { name: 'Render', category: 'Cloud & DevOps', defaultPercentage: 72 },
  { name: 'Vercel', category: 'Cloud & DevOps', defaultPercentage: 75 },
  { name: 'Netlify', category: 'Cloud & DevOps', defaultPercentage: 70 },
  { name: 'Railway', category: 'Cloud & DevOps', defaultPercentage: 68 },
  { name: 'DigitalOcean', category: 'Cloud & DevOps', defaultPercentage: 65 },
  { name: 'Fly.io', category: 'Cloud & DevOps', defaultPercentage: 65 },
  // Tools & Practices
  { name: 'Cursor', category: 'Tools & Practices', defaultPercentage: 85 },
  {
    name: 'VS Code',
    category: 'Tools & Practices',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg',
    defaultPercentage: 88,
  },
  { name: 'GitHub Copilot', category: 'Tools & Practices', defaultPercentage: 80 },
  { name: 'Git & GitHub', category: 'Tools & Practices', defaultPercentage: 88 },
  { name: 'Agile Methodology', category: 'Tools & Practices', defaultPercentage: 85 },
  { name: 'Figma', category: 'Tools & Practices', defaultPercentage: 75 },
  { name: 'Jest', category: 'Tools & Practices', defaultPercentage: 80 },
  { name: 'Postman', category: 'Tools & Practices', defaultPercentage: 82 },
]

export function filterSkillRecommendations(
  query: string,
  excludeNames: string[] = [],
): SkillRecommendation[] {
  const exclude = new Set(excludeNames.map((n) => n.toLowerCase().trim()))
  const q = query.toLowerCase().trim()

  return skillRecommendations.filter((rec) => {
    if (exclude.has(rec.name.toLowerCase())) return false
    if (!q) return true
    return (
      rec.name.toLowerCase().includes(q) ||
      rec.category.toLowerCase().includes(q)
    )
  })
}

export function findSkillRecommendation(name: string): SkillRecommendation | undefined {
  const key = name.toLowerCase().trim()
  return skillRecommendations.find((r) => r.name.toLowerCase() === key)
}
