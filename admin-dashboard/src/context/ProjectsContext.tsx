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
import type { Project, ProjectStatus } from '@/types'

export type ProjectInput = Omit<Project, 'id' | 'createdAt'>

interface ProjectsContextValue {
  projects: Project[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getProject: (id: string) => Project | undefined
  addProject: (input: ProjectInput) => Promise<Project>
  updateProject: (id: string, input: ProjectInput) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  getRecentProjects: (limit?: number) => Project[]
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null)

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getProjects()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects],
  )

  const addProject = useCallback(async (input: ProjectInput) => {
    const project = await api.createProject(input as Record<string, unknown>)
    setProjects((prev) => [project, ...prev])
    return project
  }, [])

  const updateProject = useCallback(async (id: string, input: ProjectInput) => {
    const updated = await api.updateProject(id, input as Record<string, unknown>)
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    await api.deleteProject(id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getRecentProjects = useCallback(
    (limit = 4) =>
      [...projects]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit),
    [projects],
  )

  const value = useMemo(
    () => ({
      projects,
      loading,
      error,
      refresh,
      getProject,
      addProject,
      updateProject,
      deleteProject,
      getRecentProjects,
    }),
    [
      projects,
      loading,
      error,
      refresh,
      getProject,
      addProject,
      updateProject,
      deleteProject,
      getRecentProjects,
    ],
  )

  return (
    <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
  )
}

export function useProjects() {
  const ctx = useContext(ProjectsContext)
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider')
  return ctx
}

export function emptyProjectInput(): ProjectInput {
  return {
    title: '',
    category: 'Academic',
    shortDescription: '',
    detailedDescription: '',
    keyFeatures: [],
    liveDemoUrl: '',
    sourceCodeUrl: '',
    imageUrl: '',
    media: [],
    technologies: [],
    status: 'draft' as ProjectStatus,
  }
}
