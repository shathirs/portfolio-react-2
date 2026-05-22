import { LoadingBlock } from '@/components/ui/LoadingBlock'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  coerceProjectCategory,
  projectFilters,
  type ProjectFilter,
} from '@/config/projectCategories'
import { api } from '@/lib/api'
import { resolveMediaUrl } from '@/lib/mediaUrl'
import type { Project } from '@/types'
import { ExternalLink } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function matchesFilter(project: Project, filter: ProjectFilter) {
  if (filter === 'All') return true
  return coerceProjectCategory(project.category) === filter
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<ProjectFilter>('All')

  useEffect(() => {
    api
      .getProjects()
      .then(setProjects)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load projects'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => projects.filter((p) => matchesFilter(p, filter)),
    [projects, filter],
  )

  return (
    <section id="projects" className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          title="Projects"
          subtitle="Academic and personal work — full-stack apps, MERN projects, and more."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {projectFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-primary/40'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? <LoadingBlock /> : null}
        {error ? (
          <p className="mt-8 text-center text-sm text-red-600">{error}</p>
        ) : null}

        {!loading && !error ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => {
              const imageSrc = resolveMediaUrl(project.imageUrl)
              return (
              <article
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-slate-200/60 ring-1 ring-slate-100 transition-shadow hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-navy/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {coerceProjectCategory(project.category)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                    {project.shortDescription}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 ? (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        +{project.technologies.length - 4}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                    {project.liveDemoUrl?.trim() ? (
                      <a
                        href={project.liveDemoUrl.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
                      >
                        Live Demo
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-sm font-semibold text-slate-700 hover:text-primary"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            )})}
          </div>
        ) : null}

        {!loading && !error && filtered.length === 0 ? (
          <p className="mt-12 text-center text-slate-500">No projects in this category.</p>
        ) : null}
      </div>
    </section>
  )
}
