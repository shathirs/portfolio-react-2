import { Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { SkillFormModal } from '@/components/skills/SkillFormModal'
import {
  categoryCardStyles,
  categoryHeaderAccent,
  skillCategories,
} from '@/config/skillCategories'
import { useSkills } from '@/context/SkillsContext'
import { groupSkillsByCategory } from '@/lib/groupSkills'
import { getSkillIconUrl } from '@/lib/skillIcons'
import type { Skill, SkillCategory } from '@/types'

export function SkillsTable() {
  const { skills, deleteSkill } = useSkills()
  const [formSkill, setFormSkill] = useState<Skill | 'new' | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const editingSkill = formSkill && formSkill !== 'new' ? formSkill : null

  const filteredSkills = useMemo(() => {
    if (categoryFilter === 'all') return skills
    return skills.filter((s) => s.category === categoryFilter)
  }, [skills, categoryFilter])

  const groups = useMemo(
    () => groupSkillsByCategory(filteredSkills),
    [filteredSkills],
  )

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Select
          label="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All categories' },
            ...skillCategories.map((c) => ({ value: c, label: c })),
          ]}
          className="max-w-xs"
        />
        <p className="text-sm text-muted">
          {filteredSkills.length} skill{filteredSkills.length === 1 ? '' : 's'}
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-xl border border-border bg-white px-6 py-12 text-center text-sm text-muted">
          No skills yet. Add your first skill to get started.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {groups.map(({ category, skills: categorySkills }) => (
            <div
              key={category}
              className={[
                'overflow-hidden rounded-xl border shadow-sm',
                categoryCardStyles[category as SkillCategory],
              ].join(' ')}
            >
              <div className="border-b border-white/60 bg-white/50 px-5 py-4">
                <h3
                  className={[
                    'text-base font-bold',
                    categoryHeaderAccent[category as SkillCategory],
                  ].join(' ')}
                >
                  {category}
                </h3>
                <p className="text-xs text-muted">
                  {categorySkills.length} skill
                  {categorySkills.length === 1 ? '' : 's'}
                </p>
              </div>
              <ul className="divide-y divide-slate-100/80 bg-white/60">
                {categorySkills.map((skill) => {
                  const iconUrl = getSkillIconUrl(skill.name, skill.icon)
                  return (
                    <li
                      key={skill.id}
                      className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/80"
                    >
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt=""
                          className="h-8 w-8 shrink-0 object-contain"
                        />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-primary">
                          {skill.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">{skill.name}</p>
                        <div className="mt-1.5 max-w-[200px]">
                          <ProgressBar value={skill.percentage} />
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-primary">
                        {skill.percentage}%
                      </span>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => setFormSkill(skill)}
                          className="rounded-lg p-2 text-muted transition-colors hover:bg-indigo-50 hover:text-primary"
                          aria-label={`Edit ${skill.name}`}
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(skill)}
                          className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${skill.name}`}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      <SkillFormModal
        open={formSkill !== null}
        skill={editingSkill}
        onClose={() => setFormSkill(null)}
      />

      <Modal
        open={!!deleteTarget}
        title="Delete skill?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be removed from your portfolio.`
            : undefined
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await deleteSkill(deleteTarget.id)
          setDeleteTarget(null)
        }}
        confirmLabel="Delete"
      />
    </>
  )
}
