import { LoadingBlock } from '@/components/ui/LoadingBlock'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { api } from '@/lib/api'
import type { Education } from '@/types'
import { hasUrl } from '@/lib/hasUrl'
import { ExternalLink, GraduationCap } from 'lucide-react'
import { useEffect, useState } from 'react'

export function EducationSection() {
  const [entries, setEntries] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getEducation()
      .then(setEntries)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load education'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="education" className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          title="Education"
          subtitle="Academic background and qualifications."
        />
        {loading ? <LoadingBlock /> : null}
        {error ? (
          <p className="mt-8 text-center text-sm text-red-600">{error}</p>
        ) : null}
        {!loading && !error ? (
          <div className="relative mx-auto mt-14 max-w-3xl">
            <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-indigo-100 md:block" />
            <ul className="space-y-10">
              {entries.map((entry, i) => (
                <li key={entry.id} className="relative flex gap-6 md:gap-10">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div
                    className={`flex-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${
                      i === 0 ? 'ring-2 ring-primary/20' : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{entry.degree}</h3>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-primary">
                        {entry.period}
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-slate-700">{entry.institution}</p>
                    {entry.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-slate-500">
                        {entry.description}
                      </p>
                    ) : null}
                    {hasUrl(entry.liveDemoUrl) ? (
                      <a
                        href={entry.liveDemoUrl.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover"
                      >
                        Live Demo
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
