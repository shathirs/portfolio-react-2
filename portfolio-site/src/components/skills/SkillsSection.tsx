import { LoadingBlock } from '@/components/ui/LoadingBlock'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SkillIcon } from '@/components/skills/SkillIcon'
import {
  categoryCardStyles,
  categoryHeaderAccent,
  type SkillCategory,
} from '@/config/skillCategories'
import { api } from '@/lib/api'
import { groupSkillsByCategory } from '@/lib/groupSkills'
import type { Skill } from '@/types'
import { useEffect, useMemo, useState } from 'react'

function SkillRow({ skill }: { skill: Skill }) {
  return (
    <div className="flex items-center gap-3">
      <SkillIcon name={skill.name} icon={skill.icon} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-slate-800">{skill.name}</span>
          <span className="shrink-0 text-sm font-semibold text-primary">
            {skill.percentage}%
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-violet-400"
            style={{ width: `${skill.percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getSkills()
      .then(setSkills)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load skills'))
      .finally(() => setLoading(false))
  }, [])

  const groups = useMemo(() => groupSkillsByCategory(skills), [skills])

  return (
    <section id="skills" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          title="My Skills"
          subtitle="Technologies and tools I use — grouped by area of expertise."
        />
        {loading ? <LoadingBlock /> : null}
        {error ? (
          <p className="mt-8 text-center text-sm text-red-600">{error}</p>
        ) : null}
        {!loading && !error ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map(({ category, skills: categorySkills }) => (
              <article
                key={category}
                className={[
                  'rounded-2xl border p-6 shadow-sm shadow-slate-200/50',
                  categoryCardStyles[category as SkillCategory],
                ].join(' ')}
              >
                <h3
                  className={[
                    'text-lg font-bold',
                    categoryHeaderAccent[category as SkillCategory],
                  ].join(' ')}
                >
                  {category}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {categorySkills.length} skill
                  {categorySkills.length === 1 ? '' : 's'}
                </p>
                <div className="mt-5 space-y-4">
                  {categorySkills.map((skill) => (
                    <SkillRow key={skill.id} skill={skill} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
