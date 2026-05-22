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
import type { Education } from '@/types'

export type EducationInput = Omit<Education, 'id' | 'createdAt' | 'updatedAt'>

interface EducationContextValue {
  entries: Education[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addEntry: (input: EducationInput) => Promise<Education>
  updateEntry: (id: string, input: EducationInput) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  moveEntry: (id: string, direction: 'up' | 'down') => Promise<void>
}

const EducationContext = createContext<EducationContextValue | null>(null)

function sortEntries(list: Education[]) {
  return [...list].sort((a, b) => a.order - b.order || a.degree.localeCompare(b.degree))
}

export function EducationProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getEducation()
      setEntries(sortEntries(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load education')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addEntry = useCallback(async (input: EducationInput) => {
    const entry = await api.createEducation(input as Record<string, unknown>)
    setEntries((prev) => sortEntries([...prev, entry]))
    return entry
  }, [])

  const updateEntry = useCallback(async (id: string, input: EducationInput) => {
    const updated = await api.updateEducation(id, input as Record<string, unknown>)
    setEntries((prev) => sortEntries(prev.map((e) => (e.id === id ? updated : e))))
  }, [])

  const deleteEntry = useCallback(async (id: string) => {
    await api.deleteEducation(id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const moveEntry = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      const sorted = sortEntries(entries)
      const index = sorted.findIndex((e) => e.id === id)
      if (index < 0) return

      const swapIndex = direction === 'up' ? index - 1 : index + 1
      if (swapIndex < 0 || swapIndex >= sorted.length) return

      const current = sorted[index]
      const neighbor = sorted[swapIndex]

      await Promise.all([
        api.updateEducation(current.id, {
          degree: current.degree,
          institution: current.institution,
          period: current.period,
          description: current.description,
          liveDemoUrl: current.liveDemoUrl ?? '',
          order: neighbor.order,
        }),
        api.updateEducation(neighbor.id, {
          degree: neighbor.degree,
          institution: neighbor.institution,
          period: neighbor.period,
          description: neighbor.description,
          liveDemoUrl: neighbor.liveDemoUrl ?? '',
          order: current.order,
        }),
      ])

      setEntries((prev) => {
        const next = prev.map((e) => {
          if (e.id === current.id) return { ...e, order: neighbor.order }
          if (e.id === neighbor.id) return { ...e, order: current.order }
          return e
        })
        return sortEntries(next)
      })
    },
    [entries],
  )

  const value = useMemo(
    () => ({
      entries,
      loading,
      error,
      refresh,
      addEntry,
      updateEntry,
      deleteEntry,
      moveEntry,
    }),
    [entries, loading, error, refresh, addEntry, updateEntry, deleteEntry, moveEntry],
  )

  return (
    <EducationContext.Provider value={value}>{children}</EducationContext.Provider>
  )
}

export function useEducation() {
  const ctx = useContext(EducationContext)
  if (!ctx) throw new Error('useEducation must be used within EducationProvider')
  return ctx
}

export function emptyEducationInput(order = 1): EducationInput {
  return {
    degree: '',
    institution: '',
    period: '',
    description: '',
    liveDemoUrl: '',
    order,
  }
}
