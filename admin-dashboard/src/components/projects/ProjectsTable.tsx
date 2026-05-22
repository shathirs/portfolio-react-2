import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useProjects } from '@/context/ProjectsContext'
import { resolveMediaUrl } from '@/lib/mediaUrl'
import type { Project } from '@/types'

export function ProjectsTable() {
  const { projects, deleteProject } = useProjects()
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  async function confirmDelete() {
    if (deleteTarget) {
      await deleteProject(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50/80">
                <th className="px-6 py-3.5 font-semibold text-slate-700">Title</th>
                <th className="px-6 py-3.5 font-semibold text-slate-700">Category</th>
                <th className="px-6 py-3.5 font-semibold text-slate-700">Live Demo</th>
                <th className="px-6 py-3.5 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3.5 text-right font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => {
                const thumb = resolveMediaUrl(project.imageUrl)
                return (
                <tr key={project.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-medium text-muted">
                          {project.title.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{project.title}</p>
                        <p className="truncate text-xs text-muted max-w-[200px]">
                          {project.shortDescription}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted">{project.category}</td>
                  <td className="px-6 py-4">
                    {project.liveDemoUrl ? (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary-hover"
                      >
                        View
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={project.status}>{project.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/projects/${project.id}/edit`}
                        className="rounded-lg p-2 text-muted transition-colors hover:bg-indigo-50 hover:text-primary"
                        aria-label={`Edit ${project.title}`}
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(project)}
                        className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${project.title}`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        {projects.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-muted">
            No projects yet. Add your first project to get started.
          </p>
        ) : null}
      </div>

      <Modal
        open={!!deleteTarget}
        title="Delete project?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed. This cannot be undone.`
            : undefined
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirmLabel="Delete"
      />
    </>
  )
}
