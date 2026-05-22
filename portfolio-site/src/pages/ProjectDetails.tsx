import { LoadingBlock } from '@/components/ui/LoadingBlock'
import { api } from '@/lib/api'
import { ProjectMediaGallery } from '@/components/projects/ProjectMediaGallery'
import { resolveMediaUrl } from '@/lib/mediaUrl'
import type { Project } from '@/types'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api
      .getProject(id)
      .then(setProject)
      .catch((e) => setError(e instanceof Error ? e.message : 'Project not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="bg-slate-50 py-20">
        <LoadingBlock label="Loading project…" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="text-red-600">{error || 'Project not found'}</p>
        <Link to="/#projects" className="mt-6 inline-block text-primary font-semibold">
          ← Back to projects
        </Link>
      </div>
    )
  }

  const features = project.keyFeatures ?? []
  const imageSrc = resolveMediaUrl(project.imageUrl)

  return (
    <div className="bg-slate-50 pb-20 pt-8">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {project.category}
            </span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{project.shortDescription}</p>

            {imageSrc ? (
              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <img
                  src={imageSrc}
                  alt={project.title}
                  className="w-full object-cover"
                />
              </div>
            ) : null}

            <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
              <h2 className="text-xl font-bold text-slate-900">Overview</h2>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-600">
                {project.detailedDescription}
              </p>
            </div>

            <ProjectMediaGallery media={project.media} projectTitle={project.title} />
          </div>

          <aside className="space-y-6">
            {features.length > 0 ? (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Key Features</h2>
                <ul className="mt-4 space-y-3">
                  {features.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Tech Stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {project.liveDemoUrl?.trim() ? (
                <a
                  href={project.liveDemoUrl.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  Live Demo
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
              {project.sourceCodeUrl?.trim() ? (
                <a
                  href={project.sourceCodeUrl.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-primary hover:text-primary"
                >
                  View Source Code
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
