import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProjectsTable } from '@/components/projects/ProjectsTable'
import { Button } from '@/components/ui/Button'
import { PageError, PageLoader } from '@/components/ui/PageLoader'
import { useProjects } from '@/context/ProjectsContext'

export function Projects() {
  const { loading, error, refresh } = useProjects()

  if (loading) return <PageLoader label="Loading projects…" />
  if (error) return <PageError message={error} onRetry={refresh} />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Manage portfolio projects shown on your public site.
        </p>
        <Link to="/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add New Project
          </Button>
        </Link>
      </div>

      <ProjectsTable />
    </div>
  )
}
