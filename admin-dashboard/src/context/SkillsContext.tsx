import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '@/lib/api'
import type { Skill } from '@/types'

export type SkillInput = Omit<Skill, 'id'>

interface SkillsContextValue {
  skills: Skill[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getSkill: (id: string) => Skill | undefined
  addSkill: (input: SkillInput) => Promise<Skill>
  updateSkill: (id: string, input: SkillInput) => Promise<void>
  deleteSkill: (id: string) => Promise<void>
}

const SkillsContext = createContext<SkillsContextValue | null>(null)

export function SkillsProvider({ children }: { children: ReactNode }) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getSkills()
      setSkills(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const getSkill = useCallback(
    (id: string) => skills.find((s) => s.id === id),
    [skills],
  )

  const addSkill = useCallback(async (input: SkillInput) => {
    const skill = await api.createSkill(input as Record<string, unknown>)
    setSkills((prev) =>
      [...prev, skill].sort(
        (a, b) =>
          a.category.localeCompare(b.category) || b.percentage - a.percentage,
      ),
    )
    return skill
  }, [])

  const updateSkill = useCallback(async (id: string, input: SkillInput) => {
    const updated = await api.updateSkill(id, input as Record<string, unknown>)
    setSkills((prev) =>
      [...prev.map((s) => (s.id === id ? updated : s))].sort(
        (a, b) =>
          a.category.localeCompare(b.category) || b.percentage - a.percentage,
      ),
    )
  }, [])

  const deleteSkill = useCallback(async (id: string) => {
    await api.deleteSkill(id)
    setSkills((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      skills,
      loading,
      error,
      refresh,
      getSkill,
      addSkill,
      updateSkill,
      deleteSkill,
    }),
    [skills, loading, error, refresh, getSkill, addSkill, updateSkill, deleteSkill],
  )

  return <SkillsContext.Provider value={value}>{children}</SkillsContext.Provider>
}

export function useSkills() {
  const ctx = useContext(SkillsContext)
  if (!ctx) throw new Error('useSkills must be used within SkillsProvider')
  return ctx
}

export function emptySkillInput(): SkillInput {
  return { name: '', category: 'Frontend', percentage: 50, icon: '' }
}
