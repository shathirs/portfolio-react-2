import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { SkillSuggestions } from '@/components/skills/SkillSuggestions'
import { skillCategories, categoryBadgeStyles } from '@/config/skillCategories'
import { findSkillRecommendation, type SkillRecommendation } from '@/data/skillRecommendations'
import { emptySkillInput, useSkills, type SkillInput } from '@/context/SkillsContext'
import { api } from '@/lib/api'
import { getSkillIconUrl } from '@/lib/skillIcons'
import type { Skill, SkillCategory } from '@/types'

interface SkillFormModalProps {
  open: boolean
  skill: Skill | null
  onClose: () => void
}

export function SkillFormModal({ open, skill, onClose }: SkillFormModalProps) {
  const { skills, addSkill, updateSkill } = useSkills()
  const [form, setForm] = useState<SkillInput>(emptySkillInput())
  const [errors, setErrors] = useState<Partial<Record<keyof SkillInput, string>>>({})
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<SkillRecommendation[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiConfigured, setAiConfigured] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isEdit = Boolean(skill)

  const existingNames = useMemo(
    () => skills.filter((s) => s.id !== skill?.id).map((s) => s.name),
    [skills, skill?.id],
  )

  const previewIcon = getSkillIconUrl(form.name, form.icon)

  const fetchAiSuggestions = useCallback(
    async (query: string) => {
      setAiLoading(true)
      setAiError(null)
      try {
        const res = await api.suggestSkills({
          query,
          excludeNames: existingNames,
          profileHint: 'MERN stack developer portfolio',
        })
        setAiConfigured(res.configured !== false)
        setAiSuggestions(res.suggestions ?? [])
        if (res.message && !res.suggestions?.length) {
          setAiError(res.message)
        }
      } catch (err) {
        setAiSuggestions([])
        setAiError(err instanceof Error ? err.message : 'AI suggestions unavailable')
      } finally {
        setAiLoading(false)
      }
    },
    [existingNames],
  )

  useEffect(() => {
    if (open) {
      setForm(
        skill
          ? {
              name: skill.name,
              category: skill.category,
              percentage: skill.percentage,
              icon: skill.icon,
            }
          : emptySkillInput(),
      )
      setErrors({})
      setShowSuggestions(!skill)
      setAiSuggestions([])
      setAiError(null)
    }
  }, [open, skill])

  useEffect(() => {
    if (!open || isEdit || !showSuggestions) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      fetchAiSuggestions(form.name)
    }, 600)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [form.name, open, isEdit, showSuggestions, fetchAiSuggestions])

  if (!open) return null

  function applyRecommendation(rec: SkillRecommendation) {
    setForm((f) => ({
      ...f,
      name: rec.name,
      category: rec.category,
      icon: rec.icon?.trim() ?? '',
      percentage: rec.defaultPercentage ?? f.percentage,
    }))
    setShowSuggestions(false)
    setErrors({})
  }

  function handleNameChange(value: string) {
    setForm((f) => {
      const match = findSkillRecommendation(value)
      const exactMatch =
        match && value.trim().toLowerCase() === match.name.toLowerCase()
      const iconUrl = exactMatch
        ? match.icon || getSkillIconUrl(match.name, match.icon) || ''
        : getSkillIconUrl(value) || ''
      return {
        ...f,
        name: value,
        ...(exactMatch
          ? {
              category: match.category,
              icon: match.icon?.trim() || iconUrl,
              percentage: match.defaultPercentage ?? f.percentage,
            }
          : {
              icon: iconUrl,
            }),
      }
    })
  }

  function validate() {
    const next: Partial<Record<keyof SkillInput, string>> = {}
    if (!form.name.trim()) next.name = 'Skill name is required'
    if (!form.category) next.category = 'Category is required'
    if (form.percentage < 0 || form.percentage > 100) {
      next.percentage = 'Percentage must be between 0 and 100'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      name: form.name.trim(),
      category: form.category,
      percentage: form.percentage,
      icon: form.icon?.trim() || '',
    }
    try {
      if (isEdit && skill) {
        await updateSkill(skill.id, payload)
      } else {
        await addSkill(payload)
      }
      onClose()
    } catch {
      setErrors({ name: 'Failed to save skill.' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">
          {isEdit ? 'Edit Skill' : 'Add New Skill'}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {isEdit
            ? 'Update skill details shown on your portfolio.'
            : 'Search, pick AI suggestions, or choose a popular skill — logo and category fill automatically.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="relative">
            <div className="flex gap-3">
              {previewIcon ? (
                <img
                  src={previewIcon}
                  alt=""
                  className="mt-8 h-10 w-10 shrink-0 rounded-lg border border-border bg-slate-50 object-contain p-1"
                />
              ) : (
                <span className="mt-8 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-primary">
                  {form.name.trim() ? form.name.charAt(0) : '?'}
                </span>
              )}
              <div className="relative min-w-0 flex-1">
                <Input
                  label="Skill Name"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search React.js, AWS, Docker…"
                  error={errors.name}
                  autoComplete="off"
                />
                {showSuggestions && !isEdit ? (
                  <SkillSuggestions
                    query={form.name}
                    existingNames={existingNames}
                    onSelect={applyRecommendation}
                    aiSuggestions={aiSuggestions}
                    aiLoading={aiLoading}
                    aiError={aiError}
                    aiConfigured={aiConfigured}
                  />
                ) : null}
              </div>
            </div>
            {!isEdit ? (
              <Button
                type="button"
                variant="secondary"
                className="mt-3 w-full gap-2 text-sm"
                disabled={aiLoading}
                onClick={() => {
                  setShowSuggestions(true)
                  fetchAiSuggestions(form.name)
                }}
              >
                <Sparkles className="h-4 w-4" />
                {aiLoading ? 'AI thinking…' : 'AI suggest skills for my portfolio'}
              </Button>
            ) : null}
          </div>

          <Select
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                category: e.target.value as SkillCategory,
              }))
            }
            options={skillCategories.map((c) => ({ value: c, label: c }))}
            error={errors.category}
          />

          {form.category ? (
            <p className="-mt-3 text-xs text-muted">
              Category:{' '}
              <span
                className={[
                  'rounded px-1.5 py-0.5 font-semibold',
                  categoryBadgeStyles[form.category],
                ].join(' ')}
              >
                {form.category}
              </span>
              {previewIcon ? ' · Logo detected' : ''}
            </p>
          ) : null}

          <div>
            <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
              <span>Proficiency</span>
              <span className="text-primary">{form.percentage}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={form.percentage}
              onChange={(e) =>
                setForm((f) => ({ ...f, percentage: Number(e.target.value) }))
              }
              className="w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>0%</span>
              <span>100%</span>
            </div>
            {errors.percentage ? (
              <p className="mt-1.5 text-xs text-red-500">{errors.percentage}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? 'Save Changes' : 'Add Skill'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
