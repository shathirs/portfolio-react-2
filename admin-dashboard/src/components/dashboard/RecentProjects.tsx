import { ArrowRight, FolderKanban } from 'lucide-react'
import { Link } from 'react-router-dom'
import { resolveMediaUrl } from '@/lib/mediaUrl'
import type { Project } from '@/types'
import { formatDate } from '@/lib/formatDate'

interface RecentProjectsProps {
  projects: Project[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="font-semibold text-slate-900">Recent Projects</h2>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          View All Projects
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>

      <ul className="divide-y divide-border">
        {projects.map((project) => {
          const thumb = resolveMediaUrl(project.imageUrl)
          return (
          <li key={project.id}>
            <Link
              to={`/projects/${project.id}/edit`}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                  <FolderKanban className="h-5 w-5" strokeWidth={1.75} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">{project.title}</p>
                <p className="text-xs text-muted">{project.category}</p>
              </div>
              <span className="shrink-0 text-xs text-muted">
                {formatDate(project.createdAt)}
              </span>
            </Link>
          </li>
        )})}
      </ul>

      {projects.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-muted">No projects yet.</p>
      ) : null}
    </div>
  )
}
